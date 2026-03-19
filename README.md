# E3C Grid

## Website Webhook Integration

Submit lead intake payloads to:

- `POST /api/intake`
- Production example: `https://e3cgrid.vercel.app/api/intake`

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

### Browser Fetch Example

```ts
await fetch("https://e3cgrid.vercel.app/api/intake", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
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
