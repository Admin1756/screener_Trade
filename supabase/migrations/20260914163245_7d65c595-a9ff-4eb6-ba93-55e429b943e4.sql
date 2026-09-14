CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;
CREATE TYPE public.app_role AS ENUM ('admin');
CREATE TYPE public.compliance_status AS ENUM ('COMPLIANT','NON_COMPLIANT','UNDER_REVIEW','NOT_AVAILABLE');
CREATE TYPE public.dataset_status AS ENUM ('draft','active','archived','failed');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.dataset_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version integer NOT NULL,
  status public.dataset_status NOT NULL DEFAULT 'draft',
  source_filename text,
  record_count integer NOT NULL DEFAULT 0,
  warning_count integer NOT NULL DEFAULT 0,
  error_count integer NOT NULL DEFAULT 0,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
CREATE UNIQUE INDEX dataset_versions_version_key ON public.dataset_versions(version);
CREATE UNIQUE INDEX dataset_versions_one_active ON public.dataset_versions((status)) WHERE status = 'active';
GRANT SELECT ON public.dataset_versions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dataset_versions TO authenticated;
GRANT ALL ON public.dataset_versions TO service_role;
ALTER TABLE public.dataset_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can see the live dataset" ON public.dataset_versions FOR SELECT TO anon, authenticated USING (status = 'active');
CREATE POLICY "Admins manage datasets" ON public.dataset_versions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.stocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_version_id uuid NOT NULL REFERENCES public.dataset_versions(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  symbol text NOT NULL,
  nse_symbol text,
  bse_symbol text,
  exchange text,
  charting_symbol text,
  price numeric,
  price_display text,
  currency text DEFAULT 'INR',
  status public.compliance_status NOT NULL DEFAULT 'UNDER_REVIEW',
  compliance_date date,
  record_updated_at date,
  business_activity_status text,
  financial_screening_status text,
  notes text,
  source text,
  search_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX stocks_dataset_idx ON public.stocks(dataset_version_id);
CREATE INDEX stocks_symbol_idx ON public.stocks(dataset_version_id, upper(symbol));
CREATE INDEX stocks_search_idx ON public.stocks USING gin (search_text extensions.gin_trgm_ops);
GRANT SELECT ON public.stocks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stocks TO authenticated;
GRANT ALL ON public.stocks TO service_role;
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read stocks in the live dataset" ON public.stocks FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.dataset_versions d WHERE d.id = stocks.dataset_version_id AND d.status = 'active'));
CREATE POLICY "Admins manage stocks" ON public.stocks FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins write audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin') AND user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.publish_dataset(_dataset_id uuid)
RETURNS public.dataset_versions LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _rows integer;
  _result public.dataset_versions;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  SELECT count(*) INTO _rows FROM public.stocks WHERE dataset_version_id = _dataset_id;
  IF _rows = 0 THEN
    RAISE EXCEPTION 'Refusing to publish an empty dataset';
  END IF;
  UPDATE public.dataset_versions SET status = 'archived' WHERE status = 'active';
  UPDATE public.dataset_versions
     SET status = 'active', published_at = now(), record_count = _rows
   WHERE id = _dataset_id
  RETURNING * INTO _result;
  DELETE FROM public.dataset_versions
   WHERE status = 'archived'
     AND id NOT IN (SELECT id FROM public.dataset_versions WHERE status = 'archived' ORDER BY version DESC LIMIT 3);
  RETURN _result;
END;
$$;

INSERT INTO public.site_settings (key, value) VALUES
 ('methodology', '{"intro":"Classifications are based on Zamzam Capital''s selected Shariah-screening methodology and its maintained data. Update this text from the admin portal.","business_activity":"Companies whose core business activities fall outside permissible sectors under the screening criteria used by Zamzam Capital are classified as non-compliant.","financial_screening":"Financial ratios are assessed against the thresholds published by Zamzam Capital. Thresholds are maintained in the admin portal and are not generated automatically.","data_updates":"Screening data is refreshed when Zamzam Capital publishes a new dataset.","thresholds":""}'::jsonb),
 ('about', '{"body":"Zamzam Capital is focused on making Shariah-focused stock research simpler, faster and more accessible. The platform provides tools that help investors check the Shariah status of stocks using Zamzam Capital''s maintained screening data."}'::jsonb),
 ('social', '{"instagram":"","youtube":"","linkedin":"","telegram":""}'::jsonb),
 ('data_source', '{"label":"Prices shown are reference values from the dataset published by Zamzam Capital, not a live market feed."}'::jsonb);