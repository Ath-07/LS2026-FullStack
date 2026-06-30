# Week 3 — Stagecoach Manifest

**Frontier:** Stagecoach Manifest

A REST API for a Wild West stagecoach line, tracking valuable cargo shipments between towns. Built with Django REST Framework and JWT authentication.

## Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register/` | Create a new user |
| POST | `/api/auth/login/` | Obtain JWT access + refresh tokens |
| POST | `/api/auth/refresh/` | Refresh an access token |
| GET | `/api/bounties/` | List user's shipments (auth required) |
| POST | `/api/bounties/` | Create a new shipment (auth required) |
| GET | `/api/bounties/<id>/` | Retrieve a shipment (auth + ownership) |
| PUT/PATCH | `/api/bounties/<id>/` | Update a shipment (auth + ownership) |
| DELETE | `/api/bounties/<id>/` | Delete a shipment (auth + ownership) |

## Field Mapping

| JSON Key | Stagecoach Meaning |
|---|---|
| `target_name` | Cargo description |
| `reward` | Declared value (dollars) |
| `status` | `wanted` = in transit, `captured` = delivered |

Owner is implicit — always resolves to the authenticated user. Users can never access another user's shipments.

## Setup

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Bonus Features

### Rate Limiting

- **Authenticated users:** 100 requests/day
- **Anonymous users:** 10 requests/hour
- Applied globally via DRF's `UserRateThrottle` and `AnonRateThrottle`

### Caching

- The `GET /api/bounties/` list endpoint caches the response per-user for 60 seconds using Django's `LocMemCache`
- The cache is automatically invalidated on any create, update, or delete operation, ensuring listing always returns fresh data after writes
