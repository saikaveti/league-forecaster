# API Specification

## FantasyAccountIdentifier

### POST `/common/account-identifier/`
Adds a new Fantasy Account Identifier for a given platform and retrieve ID. Validates the retrieve ID for the `Fantrax` platform by calling the `fantrax_get_leagues` method.

#### Request Headers
- `Authorization`: Bearer token for authentication.

#### Request Body
| Parameter   | Type   | Required | Description                          |
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

#### Responses
- **201 Created**: The account identifier was successfully added.
  ```json
  {
    "id": 1,
    "platform": "Fantrax",
    "sport": "Baseball"
  }
  ```
- **400 Bad Request**: The request was invalid, or the retrieve ID could not be validated.
  ```json
  {
    "error": "Invalid retrieve_id or unable to fetch leagues."
  }
  ```

#### Notes
- The `account_id` and `retrieve_id` are extracted from the Bearer Token in the `Authorization` header.
- For the `Fantrax` platform, the `retrieve_id` is validated by calling the `fantrax_get_leagues` method from the `ApiClient`.

---

## FantasyAccountLeague

### GET `/sport/{sport}/platform/{platform}/`
Retrieves a list of leagues for a specific account, sport, and platform.

#### Request Headers
- `Authorization`: Bearer token for authentication.

#### Path Parameters
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
/sport/MLB/platform/Fantrax/
```

#### Responses
- **200 OK**: A list of leagues associated with the account, sport, and platform.
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
- **400 Bad Request**: Invalid input or missing required parameters.
  ```json
  {
    "error": "Sport and platform are required."
  }
  ```
- **401 Unauthorized**: Missing or invalid authorization token.
  ```json
  {
    "error": "Authorization header missing or invalid."
  }
  ```
- **404 Not Found**: No `retrieve_id` exists for the given account, sport, and platform combination.
  ```json
  {
    "error": "No retrieve_id exists for this account, sport, and platform combination."
  }
  ```

#### Notes
- The `account_id` is extracted from the Bearer Token.
- For the `Fantrax` platform, the `retrieve_id` is fetched from the database and used to call the Fantrax API to retrieve leagues.

---

### POST `/sport/{sport}/platform/{platform}/`
Adds leagues for a specific account, sport, and platform, and then syncs the data.

#### Request Headers
- `Authorization`: Bearer token for authentication.

#### Path Parameters
| Parameter   | Type   | Required | Description                          |
|-------------|--------|----------|--------------------------------------|
| `sport`     | string | Yes      | The sport for which leagues are being added. |
| `platform`  | string | Yes      | The platform (e.g., `Fantrax`).      |

#### Request Body
| Parameter   | Type   | Required | Description                          |
|-------------|--------|----------|--------------------------------------|
| `league_ids`| array  | Yes      | List of league IDs to be added.      |

#### Example
**Headers:**
```http
Authorization: Bearer <token>
```

**Body:**
```json
{
  "league_ids": ["league_id_1", "league_id_2"]
}
```

#### Responses
- **200 OK**: Leagues processed and synced successfully.
  ```json
  {
    "message": "Leagues processed and synced successfully."
  }
  ```
- **400 Bad Request**: Invalid input or missing required fields.
  ```json
  {
    "error": "A list of league_ids is required."
  }
  ```
- **401 Unauthorized**: Missing or invalid authorization token.
  ```json
  {
    "error": "Authorization header missing or invalid."
  }
  ```
- **404 Not Found**: No teams found for the given account and sport.
  ```json
  {
    "error": "No teams found for the given account and sport."
  }
  ```

---

### POST `/sport/{sport}/`
Syncs team rosters and rostered data for all teams associated with the account and sport.

#### Request Headers
- `Authorization`: Bearer token for authentication.

#### Path Parameters
| Parameter   | Type   | Required | Description                          |
|-------------|--------|----------|--------------------------------------|
| `sport`     | string | Yes      | The sport for which data is being synced. |

#### Example
**Headers:**
```http
Authorization: Bearer <token>
```

**URL:**
```
/sport/MLB/
```

#### Responses
- **200 OK**: Sync completed successfully.
  ```json
  {
    "message": "Sync completed successfully."
  }
  ```
- **400 Bad Request**: Invalid input or missing required fields.
  ```json
  {
    "error": "Sport is required."
  }
  ```
- **401 Unauthorized**: Missing or invalid authorization token.
  ```json
  {
    "error": "Authorization header missing or invalid."
  }
  ```
- **404 Not Found**: No teams found for the given account and sport.
  ```json
  {
    "error": "No teams found for the given account and sport."
  }
  ```

#### Notes
- The `account_id` is extracted from the Bearer Token.
- The `sport` is provided as part of the URL path.