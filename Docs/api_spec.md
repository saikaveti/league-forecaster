# API Specification

## FantasyAccountIdentifier

### Endpoint
`POST /common/account-identifier/`

### Description
Adds a new Fantasy Account Identifier for a given platform and retrieve ID. Validates the retrieve ID for the `Fantrax` platform by calling the `fantrax_get_leagues` method.

### Authentication
- Requires a Bearer Token in the `Authorization` header.
- The token must include:
  - `account_id`: The account identifier.
  - `retrieve_id`: The retrieve ID for validation.

### Request Body
| Field       | Type   | Required | Description                          |
|-------------|--------|----------|--------------------------------------|
| `platform`  | string | Yes      | The platform name (e.g., `Fantrax`). |
| `sport`     | string | Yes      | The sport name (e.g., `Baseball`).   |

#### Example
**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "platform": "Fantrax",
  "sport": "Baseball"
}
```

### Responses

#### 201 Created
The account identifier was successfully added.

**Example Response:**
```json
{
  "id": 1,
  "platform": "Fantrax",
  "sport": "Baseball"
}
```

#### 400 Bad Request
The request was invalid, or the retrieve ID could not be validated.

**Example Response:**
```json
{
  "error": "Invalid retrieve_id or unable to fetch leagues."
}
```

### Notes
- The `account_id` and `retrieve_id` are extracted from the Bearer Token in the `Authorization` header.
- The `platform` and `sport` are provided in the POST request body.
- For the `Fantrax` platform, the `retrieve_id` is validated by calling the `fantrax_get_leagues` method from the `ApiClient`.
- If the validation fails, the API returns a `400 Bad Request` response.