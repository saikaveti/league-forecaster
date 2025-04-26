import jwt
from requests import Response

def decode_token(token):
    """
    Decode a JWT bearer token and return the data.

    :param token: The JWT token to decode.
    :return: The decoded data as a dictionary.
    :raises: jwt.ExpiredSignatureError, jwt.InvalidTokenError
    """
    secret_key = "your_secret_key"  # Replace with your actual secret key
    try:
        decoded_data = jwt.decode(token, secret_key, algorithms=["HS256"])
        return decoded_data
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired.")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token.")