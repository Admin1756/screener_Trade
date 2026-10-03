# Zamzam Stock Scan

Build a Professional Website & Stock Screening Tool for Zamzam Capital

Create a premium, production-ready website and web application for Zamzam Capital.

Zamzam Capital provides a simple tool that helps users check whether a stock is Shariah-compliant or non-compliant. The website should feel like a serious financial technology platform — trustworthy, modern, fast and professional.

The primary purpose is not to make a normal company website. It is a Shariah-compliance stock screening tool, with information about Zamzam Capital and its social platforms integrated around the product.

1. Brand & Design

Brand name:

Zamzam Capital

Use the official Zamzam Capital brand colors consistently throughout the website.

Design direction:

Premium fintech aesthetic

Dark and sophisticated interface

Professional financial-dashboard appearance

Clean typography

Minimal UI

Subtle glass effects

Smooth animations

Modern cards

Excellent spacing

High-quality responsive design

Desktop + mobile optimized

Avoid:

Cartoon graphics

Excessive gradients

Cheap-looking templates

Generic AI illustrations

Overly decorative elements

Excessive animations

The website should look like a real financial technology product.

2. Main Purpose

The main headline should communicate the core purpose immediately:

Check Your Stock's Shariah Compliance

Supporting text:

Search a stock or paste its charting link to quickly check its Shariah-compliance status.

Primary interface:

Search Stock / Company / Symbol

or

Paste Charting Link

Button:

Check Compliance

Small supporting text:

Fast • Simple • Shariah-Focused

3. Homepage Hero

Create a visually impressive hero section.

Background:

Subtle animated financial chart

Market-data style motion

Dark grid

Moving data points

Abstract stock-market lines

Very subtle ticker animations

The animation should create the feeling of a professional financial platform without distracting from the search tool.

Hero layout:

Left side:

Know Before You Invest.

Short description explaining Zamzam Capital's screening tool.

Right/center:

Large interactive stock-search panel.

4. Stock Search

Users should be able to search using:

Company name

Stock symbol

NSE symbol

BSE symbol where available

Partial company name

Exact ticker

Supported charting link

Example:

User enters:

RELIANCE

Result:

Reliance Industries Limited

RELIANCE • NSE

Then show:

SHARIAH STATUS

🟢 COMPLIANT

5. Charting Link Feature

Add a prominent option:

Paste Your Charting Link

Placeholder:

Paste your charting platform link here...

Button:

Analyze Stock

The system should:

Validate the URL.

Identify the stock/ticker from the supported URL.

Match it against Zamzam Capital's database.

Retrieve the relevant compliance record.

Display the exact stock/company identified.

Display the compliance result.

The interface should feel like the charting platform is seamlessly connected to Zamzam Capital.

However, do not falsely claim an official partnership or integration.

Use wording such as:

"Charting-link support by Zamzam Capital."

If an authorized API/data integration is available, use it.

Do not scrape restricted data or imitate an official partnership.

6. Exact Data Matching

A critical requirement:

If the charting/data provider supplies a market value, Zamzam Capital should display the same underlying value and precision.

Example:

Charting platform:

₹1,234.50

Zamzam Capital:

₹1,234.50

Do not independently calculate, round or modify the value.

Use an architecture such as:

Authorized Market Data Source → Data Processing Layer → Zamzam Capital UI

Separate:

Market Data

from:

Shariah Compliance Data

This makes the system reliable and easier to maintain.

If exact live data cannot legally or technically be obtained from the charting platform, do not fabricate it. Clearly indicate the actual data source.

7. Compliance Result

Create a premium result screen.

Example:

RELIANCE

Reliance Industries Limited

NSE: RELIANCE

Shariah Status

🟢 COMPLIANT

or

🔴 NON-COMPLIANT

or

🟡 UNDER REVIEW

The status should be visually impossible to miss.

Show:

Company name

Stock symbol

Exchange

Market/reference price

Currency

Compliance status

Compliance date

Last updated

Screening information

Methodology/source where appropriate

8. "Why?" Section

Under the result, add:

Why is this stock classified this way?

Display a concise explanation based on the actual database record.

Example:

This stock currently meets the Shariah screening criteria used by Zamzam Capital.

Do not generate fictional reasons.

The explanation must come from the actual compliance data/methodology.

9. Stock Database

Create a centralized backend database.

Recommended fields:

Stock ID
Company Name
Symbol
NSE Symbol
BSE Symbol
Exchange
Charting Symbol
Price
Currency
Compliance Status
Compliance Date
Last Updated
Business Activity Status
Financial Screening Status
Notes
Source


The frontend must read from this database.

Do not hardcode stock results into the frontend.

10. Admin Portal

Create a secure admin portal:

/admin

The portal should require authentication.

Dashboard:

Zamzam Capital Admin

Display:

Total stocks

Compliant stocks

Non-compliant stocks

Under-review stocks

Database version

Last update

Total records

Latest upload

11. Excel / CSV Database Upload

Admin should be able to upload:

.xlsx

.xls

.csv

Create a professional drag-and-drop uploader:

Upload Stock Database

Drag & drop your Excel or CSV file here

or

Browse Files

After upload:

Read the file.

Detect columns.

Map columns.

Validate data.

Detect duplicates.

Detect missing fields.

Show preview.

Show total records.

Show errors/warnings.

Ask admin to confirm.

Replace the active database.

Publish the new dataset.

Update database version.

Record upload time.

12. Safe Database Replacement

Do NOT simply delete the existing database before checking the new file.

Use an atomic replacement system:

Existing Database

↓

Upload New Excel/CSV

↓

Validate

↓

Create New Dataset

↓

Verify

↓

Atomic Database Swap

↓

New Dataset Live

This means a corrupted or incorrectly formatted Excel file cannot accidentally leave the website with zero stocks.

The goal should be to process thousands of stock records extremely quickly.

13. Import Preview

Before confirming the upload, show:

Database Import Preview

Total rows:

5,000

Valid:

4,982

Warnings:

12

Errors:

6

Then:

Previous database will remain active until the new dataset is successfully validated.

Buttons:

Cancel

Publish New Database

14. Column Mapping

Allow automatic column detection.

For example:

Excel:

Company

→

Company Name

Excel:

Ticker

→

Symbol

Excel:

Status

→

Compliance Status

Allow the administrator to manually change mappings when necessary.

15. Admin Security

Protect the admin system with:

Secure authentication

Password hashing

Protected routes

Session management

Logout

Rate limiting

File validation

File-size limits

Server-side validation

Audit logs

Never expose database-management endpoints publicly.

16. About Zamzam Capital

Create an elegant section:

About Zamzam Capital

Zamzam Capital is focused on making Shariah-focused stock research simpler, faster and more accessible.

Explain that the platform provides tools that help investors check the Shariah status of stocks using Zamzam Capital's maintained screening data.

Keep the wording factual.

Do not make guaranteed-return or guaranteed-profit claims.

17. Social Media

Create:

Connect With Zamzam Capital

Add professional social-media cards for:

Instagram

YouTube

LinkedIn

Telegram

Use the actual official Zamzam Capital URLs when provided.

Do not invent social-media URLs.

Cards should have:

Platform icon

Platform name

Short description

Hover animation

External-link indicator

18. Methodology Section

Create a dedicated section:

How It Works

Three steps:

01 — Search

Enter a stock name, symbol or supported charting link.

02 — Screen

Zamzam Capital checks the stock against its maintained Shariah-compliance database.

03 — Know

Receive a clear compliance status and relevant information.

Use subtle scroll animations.

19. Compliance Methodology

Create a page/section explaining:

Our Shariah Screening Approach

Explain that classifications are based on Zamzam Capital's selected Shariah-screening methodology and maintained data.

Include:

Business activity screening

Financial screening

Relevant thresholds/criteria where Zamzam Capital publishes them

Data update information

Last screening date

Do not invent a methodology or thresholds. Provide editable CMS/admin fields so Zamzam Capital can update this information.

20. Search Experience

Make the search extremely fast.

While typing:

RELI

Show suggestions such as:

RELIANCE

Reliance Industries Limited

NSE

When selected:

Open the stock result page.

Add:

Search another stock

button.

21. Mobile Experience

The mobile website must be excellent.

The search tool should be the main focus.

Use:

Large search field

Easy paste button

Clear status badge

Swipe-friendly cards

Sticky search button

Responsive navigation

Do not simply shrink the desktop website.

Design the mobile experience intentionally.

22. Navigation

Header:

Zamzam Capital

Navigation:

Home

Check Stock

How It Works

Methodology

About

Connect

Right side:

Check a Stock

CTA button.

Admin login should not be prominent in the public navigation. Use a protected admin route.

23. Footer

Footer should contain:

Zamzam Capital

Making Shariah-focused stock research simpler.

Links:

Check Stock

Methodology

About

Contact

Instagram

YouTube

LinkedIn

Telegram

Privacy Policy

Terms

Disclaimer

24. Disclaimer

Include a professional disclaimer:

Risk & Information Disclaimer

Zamzam Capital provides informational tools for Shariah-compliance screening. The information provided by this platform should not be considered a guarantee of investment performance, financial return or personalized investment advice. Users should conduct their own research and make decisions according to their individual circumstances. Shariah classifications may change as company activities, financial information or screening criteria change.

25. Animation & Interaction

Use tasteful animations:

Smooth page transitions

Search-result reveal

Number counters

Card hover effects

Animated chart background

Scroll-triggered sections

Loading skeletons

Smooth status transitions

Database-upload progress animation

Success/error animations

Animations must be fast and professional.

Do not sacrifice performance.

26. Loading States

When checking a stock, show:

Analyzing Stock...

Then:

Matching Database...

Then:

Checking Shariah Status...

Then reveal the result.

Use skeleton loaders rather than a generic spinning circle where possible.

27. Error States

If a stock cannot be found:

Stock Not Found

We couldn't find this stock in the current Zamzam Capital database.

Try searching by:

Company name

Stock symbol

NSE symbol

BSE symbol

If the charting link cannot be processed:

Unable to Read Link

We couldn't identify a supported stock from this link. Please enter the stock symbol manually.

28. Technology Architecture

Build this as a real full-stack application.

Recommended architecture:

Frontend

Next.js / React

TypeScript

Tailwind CSS

Modern component system

Responsive UI

Backend

Secure API

PostgreSQL or equivalent database

Authentication

File-processing service

Database Import

XLSX parser

CSV parser

Validation layer

Transactional/atomic dataset replacement

Deployment

Production-ready

Environment variables

Secure API keys

HTTPS

Error logging

Database backups

Do not make it only a static frontend mockup.

29. Important Data Integrity Rule

The compliance result must ALWAYS come from the current Zamzam Capital database.

Never:

Guess a compliance status

Generate a status using AI

Invent stock information

Hardcode fake prices

Fabricate charting data

Randomly classify companies

If the database does not contain the stock:

Status: Not Available

rather than guessing.

30. Overall Product Feel

The final website should feel like:

A professional financial research terminal combined with a simple Shariah-compliance checker.

It should immediately make users think:

"I can paste my stock/chart link here and instantly find out its Shariah status."

Make the product extremely simple for the user while keeping the backend powerful enough for Zamzam Capital administrators to maintain thousands of stocks.

The final result should be premium, trustworthy, fast, minimal and professional — not flashy or AI-generated-looking.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://zc-screeners.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/48132a04-71b6-4f56-9984-7285bae92525).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
