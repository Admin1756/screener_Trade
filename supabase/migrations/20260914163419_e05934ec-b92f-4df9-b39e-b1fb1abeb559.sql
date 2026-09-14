CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_overview()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT CASE WHEN NOT public.has_role(auth.uid(),'admin') THEN '{}'::jsonb ELSE jsonb_build_object(
    'total', (SELECT count(*) FROM public.stocks s JOIN public.dataset_versions d ON d.id = s.dataset_version_id AND d.status='active'),
    'compliant', (SELECT count(*) FROM public.stocks s JOIN public.dataset_versions d ON d.id = s.dataset_version_id AND d.status='active' WHERE s.status='COMPLIANT'),
    'non_compliant', (SELECT count(*) FROM public.stocks s JOIN public.dataset_versions d ON d.id = s.dataset_version_id AND d.status='active' WHERE s.status='NON_COMPLIANT'),
    'under_review', (SELECT count(*) FROM public.stocks s JOIN public.dataset_versions d ON d.id = s.dataset_version_id AND d.status='active' WHERE s.status='UNDER_REVIEW'),
    'version', (SELECT version FROM public.dataset_versions WHERE status='active'),
    'published_at', (SELECT published_at FROM public.dataset_versions WHERE status='active'),
    'source_filename', (SELECT source_filename FROM public.dataset_versions WHERE status='active')
  ) END;
$$;
REVOKE ALL ON FUNCTION public.admin_overview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_overview() TO authenticated;