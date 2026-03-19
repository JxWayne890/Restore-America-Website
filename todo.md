# Restore America Roofing & Restoration — Project TODO

## Website & Design
- [x] Premium patriotic website with American flag colors (Navy/Red/White)
- [x] New AI-generated logo with American flag shield motif
- [x] Patriotic hero section with aerial job site image
- [x] Responsive navbar with phone number and CTA
- [x] Stats bar (500+ homes, 5.0 rating, 113 reviews, 98% claims)
- [x] Interactive services section (Fire/Flood/Hail/Wind/Tree/Roof)
- [x] Trust section with before/after imagery
- [x] Reviews section with real Google testimonials
- [x] SEO/AEO-optimized FAQ accordion with schema markup
- [x] CTA banner with emergency call button
- [x] Footer with service areas, social links, emergency CTA
- [x] JSON-LD structured data (LocalBusiness, AggregateRating, Services)

## Full-Stack Infrastructure
- [x] Upgrade to full-stack (Express + tRPC + MySQL database)
- [x] Database schema: leads, appointments, activities, storm alerts, reviews, chat sessions
- [x] Run db:push to sync schema to production database

## Lead Capture & CRM
- [x] 4-step interactive lead capture form (damage type → ownership → claim → contact)
- [x] Form connected to tRPC backend (real lead submission)
- [x] Lead stored in database with full metadata
- [x] Owner notification on new lead submission (instant push notification)
- [x] Lead activity log (stage changes, notes, calls, SMS, email)
- [x] Lead pipeline with 10 stages (new → completed)
- [x] Hot lead flagging

## AI Automation
- [x] AI chat widget (GPT-powered, 24/7 lead qualification)
- [x] Chat widget connected to tRPC backend with session management
- [x] Chat-to-lead conversion (auto-creates lead when phone captured)
- [x] Storm alert banner system (admin-controlled, live on website)

## Admin Dashboard
- [x] Admin dashboard at /admin route
- [x] Pipeline kanban view (all 10 stages)
- [x] Lead list with search and stage filter
- [x] Lead detail view with activity log and note-adding
- [x] Stage management (click to move leads through pipeline)
- [x] Appointments tab
- [x] Storm alert creation and management
- [x] Analytics tab (lead stats, damage type breakdown, automation status)

## Routing & Integration
- [x] /admin route with auth protection
- [x] Storm alert banner shown globally on public pages
- [x] Chat widget shown globally on public pages
- [x] App.tsx updated with all routes

## Pending / Future Integrations
- [ ] Write vitest tests for lead submission and chat procedures
- [ ] Twilio SMS integration (automated follow-up sequences)
- [ ] SendGrid email integration (automated drip campaigns)
- [ ] GoHighLevel CRM sync via webhook
- [ ] Google Ads conversion tracking pixel
- [ ] Facebook Pixel integration
- [ ] Before/after photo gallery page (/projects)
- [ ] Booking calendar with Calendly or Cal.com embed
- [ ] Drone inspection request form
- [ ] Service area map (Google Maps)
- [ ] Blog/SEO content pages
