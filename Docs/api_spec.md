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

## FantasyAccountLeague

### Endpoint
`GET /common/account-leagues/sport/<sport>/platform/<platform>/`

### Description
Retrieves a list of leagues for a specific account, sport, and platform. The account ID is extracted from the Bearer Token in the `Authorization` header.

### Authentication
- Requires a Bearer Token in the `Authorization` header.
- The token must include:
  - `account_id`: The account identifier.

### URL Parameters
| Parameter   | Type   | Required | Description                          |
|-------------|--------|----------|--------------------------------------|
| `sport`     | string | Yes      | The sport name (e.g., `MLB`).        |
| `platform`  | string | Yes      | The platform name (e.g., `Fantrax`). |

#### Example
**Headers:**
```http
Authorization: Bearer <token>
```

**URL:**
```
/common/account-leagues/sport/MLB/platform/Fantrax/
```

### Responses

#### 200 OK
A list of leagues associated with the account, sport, and platform.

**Example Response:**
```json
[
  {
    "leagueName": "50$ Dynasty League - Year One",
    "teamName": "Portland Sea Dogs",
    "leagueId": "grb6qnx0m5mv0crr",
    "teamId": "x0o5svhhm5u7k9n7",
    "sport": "MLB"
  }
]
```

#### 400 Bad Request
The request was invalid (e.g., missing required parameters or unsupported platform).

**Example Response:**
```json
{
  "error": "Sport and platform are required."
}
```

#### 401 Unauthorized
The Bearer Token is missing or invalid.

**Example Response:**
```json
{
  "error": "Authorization header missing or invalid."
}
```

#### 404 Not Found
No `retrieve_id` exists for the given account, sport, and platform combination.

**Example Response:**
```json
{
  "error": "No retrieve_id exists for this account, sport, and platform combination."
}
```

#### 400 Bad Request (Fantrax API Error)
The Fantrax API could not fetch leagues for the given `retrieve_id`.

**Example Response:**
```json
{
  "error": "Unable to fetch leagues from Fantrax."
}
```

### Notes
- The `account_id` is extracted from the Bearer Token.
- The `sport` and `platform` are provided as part of the URL path.
- For the `Fantrax` platform, the `retrieve_id` is fetched from the database and used to call the Fantrax API to retrieve leagues.
- The response is a list of leagues associated with the account.