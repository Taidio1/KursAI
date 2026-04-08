import os
import httpx
from typing import Optional
from fastapi import Header, HTTPException
from supabase import create_client, Client
from jose import jwt, JWTError, jwk
from jose.utils import base64url_decode

# Cache kluczy publicznych z JWKS
_jwks_cache: dict = {}


def _get_jwks() -> dict:
    """Pobiera JWKS z Supabase i cachuje klucze po kid."""
    if _jwks_cache:
        return _jwks_cache
    supabase_url = os.environ["SUPABASE_URL"]
    resp = httpx.get(f"{supabase_url}/auth/v1/.well-known/jwks.json", timeout=10)
    resp.raise_for_status()
    for key in resp.json().get("keys", []):
        _jwks_cache[key["kid"]] = key
    return _jwks_cache


def get_supabase_service() -> Client:
    return create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_KEY"],
    )


def get_supabase_anon() -> Client:
    return create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_ANON_KEY"],
    )


class _User:
    def __init__(self, user_id: str):
        self.id = user_id


async def get_current_user(authorization: Optional[str] = Header(None)) -> _User:
    """FastAPI dependency — weryfikuje JWT Supabase lokalnie i zwraca obiekt użytkownika."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Brak tokenu autoryzacji")
    token = authorization.removeprefix("Bearer ").strip()
    try:
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")
        alg = header.get("alg", "HS256")

        if kid:
            # ES256 lub inne asymetryczne – weryfikuj przez JWKS
            keys = _get_jwks()
            if kid not in keys:
                raise HTTPException(status_code=401, detail="Nieznany klucz JWT")
            public_key = jwk.construct(keys[kid])
            payload = jwt.decode(token, public_key, algorithms=[alg], options={"verify_aud": False})
        else:
            # HS256 – weryfikuj przez JWT Secret
            jwt_secret = os.environ.get("SUPABASE_JWT_SECRET", "")
            if not jwt_secret:
                raise HTTPException(status_code=500, detail="Brak konfiguracji SUPABASE_JWT_SECRET")
            payload = jwt.decode(token, jwt_secret, algorithms=["HS256"], options={"verify_aud": False})

        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Nieprawidłowy token")
        return _User(user_id=user_id)
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Nieprawidłowy token")
