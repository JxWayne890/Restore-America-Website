# E3C Grid

## Website Webhook Integration

Submit lead intake payloads to:

- `POST /api/intake`
- `POST /api/intake/:organizationId`
- Production example: `https://e3-c-grid.vercel.app/api/intake/your-organization-id`

### Payload Contract

```json
{
  "fullName": "John Doe",
  "phone": "555-0123",
  "email": "john@example.com",
  "propertyAddress": "123 Main St, Dallas, TX 75201",
  "damageType": "Hail Damage",
  "propertyOwner": "Yes, I own this property",
  "insuranceClaimStatus": "Yes, claim is open",
  "source": "Main Website",
  "formAnswers": {
    "step1": "Hail Damage",
    "step2": "Yes, I own this property",
    "step3": "Yes, claim is open"
  },
  "utmCampaign": "spring-hail-2026",
  "anyFutureQuestionKey": "any future value"
}
```

Account-specific webhook URLs should use the organization ID in the path. The same payload may optionally include `organizationId`, `orgId`, or an `X-Organization-Id` header, but the URL path is now the primary contract for per-account routing.

### Browser Fetch Example

```ts
await fetch("https://e3-c-grid.vercel.app/api/intake/your-organization-id", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    organizationId: "your-organization-id",
    fullName: "John Doe",
    phone: "555-0123",
    email: "john@example.com",
    propertyAddress: "123 Main St, Dallas, TX 75201",
    damageType: "Hail Damage",
    propertyOwner: "Yes, I own this property",
    insuranceClaimStatus: "Yes, claim is open",
    source: "Main Website",
    formAnswers: {
      step1: "Hail Damage",
      step2: "Yes, I own this property",
      step3: "Yes, claim is open",
    },
    utmCampaign: "spring-hail-2026",
    anyFutureQuestionKey: "any future value",
  }),
});
```

### CORS

- Configure `ALLOWED_ORIGINS` as a comma-separated list.
- Default behavior is permissive (`*`) when `ALLOWED_ORIGINS` is not set.

### Org Routing

- Set `VITE_INTAKE_ORGANIZATION_ID` on any website that should submit into a specific account.
- `DEFAULT_ORGANIZATION_ID` can be used server-side as a fallback when the URL or payload does not include an org ID.
