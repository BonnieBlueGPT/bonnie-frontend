#!/usr/bin/env python3
"""
🔱 SUPABASE AUTH REPLACEMENT - GOTRUE CONFLICT RESOLUTION
Direct PostgreSQL + JWT authentication without gotrue dependency
"""

import jwt
import asyncpg
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Optional, Any
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os

class SupabaseAuthReplacement:
    """🧠 Direct Supabase authentication without gotrue dependency"""
    
    def __init__(self, db_url: str, jwt_secret: str, supabase_url: str):
        self.db_url = db_url
        self.jwt_secret = jwt_secret
        self.supabase_url = supabase_url
        self.db_pool = None
    
    async def initialize(self):
        """Initialize database connection pool"""
        self.db_pool = await asyncpg.create_pool(
            self.db_url,
            min_size=2,
            max_size=10
        )
    
    async def create_user(self, email: str, password: str, metadata: Dict = None) -> Dict[str, Any]:
        """Create new user account"""
        
        # Generate secure password hash
        password_hash = self._hash_password(password)
        user_id = secrets.token_urlsafe(16)
        
        async with self.db_pool.acquire() as conn:
            # Insert into auth.users table (Supabase schema)
            await conn.execute("""
                INSERT INTO auth.users 
                (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
                VALUES ($1, $2, $3, NOW(), NOW(), NOW(), $4)
            """, user_id, email, password_hash, metadata or {})
            
            # Generate JWT token
            token = self._generate_jwt_token(user_id, email)
            
            return {
                'user': {
                    'id': user_id,
                    'email': email,
                    'created_at': datetime.utcnow().isoformat(),
                    'user_metadata': metadata or {}
                },
                'access_token': token,
                'refresh_token': secrets.token_urlsafe(32)
            }
    
    async def sign_in_with_password(self, email: str, password: str) -> Dict[str, Any]:
        """Sign in user with email and password"""
        
        async with self.db_pool.acquire() as conn:
            # Get user from database
            user_row = await conn.fetchrow("""
                SELECT id, email, encrypted_password, raw_user_meta_data, created_at
                FROM auth.users 
                WHERE email = $1
            """, email)
            
            if not user_row:
                raise ValueError("Invalid email or password")
            
            # Verify password
            if not self._verify_password(password, user_row['encrypted_password']):
                raise ValueError("Invalid email or password")
            
            # Generate new JWT token
            token = self._generate_jwt_token(user_row['id'], email)
            
            return {
                'user': {
                    'id': user_row['id'],
                    'email': user_row['email'],
                    'created_at': user_row['created_at'].isoformat(),
                    'user_metadata': user_row['raw_user_meta_data'] or {}
                },
                'access_token': token,
                'refresh_token': secrets.token_urlsafe(32)
            }
    
    async def get_user(self, token: str) -> Optional[Dict[str, Any]]:
        """Get user information from JWT token"""
        
        try:
            # Decode JWT token
            payload = jwt.decode(token, self.jwt_secret, algorithms=['HS256'])
            user_id = payload.get('sub')
            
            if not user_id:
                return None
            
            async with self.db_pool.acquire() as conn:
                user_row = await conn.fetchrow("""
                    SELECT id, email, raw_user_meta_data, created_at
                    FROM auth.users 
                    WHERE id = $1
                """, user_id)
                
                if user_row:
                    return {
                        'id': user_row['id'],
                        'email': user_row['email'],
                        'created_at': user_row['created_at'].isoformat(),
                        'user_metadata': user_row['raw_user_meta_data'] or {}
                    }
                    
        except jwt.InvalidTokenError:
            return None
        
        return None
    
    async def sign_out(self, token: str) -> bool:
        """Sign out user (invalidate token)"""
        # In a full implementation, you'd maintain a token blacklist
        # For now, tokens expire naturally
        return True
    
    async def reset_password_for_email(self, email: str) -> bool:
        """Send password reset email"""
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        
        async with self.db_pool.acquire() as conn:
            # Store reset token in database
            await conn.execute("""
                UPDATE auth.users 
                SET recovery_token = $1, recovery_sent_at = NOW()
                WHERE email = $2
            """, reset_token, email)
        
        # In production, you'd send an email here
        print(f"Password reset token for {email}: {reset_token}")
        return True
    
    def _hash_password(self, password: str) -> str:
        """Hash password using PBKDF2"""
        salt = secrets.token_bytes(32)
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000
        )
        key = kdf.derive(password.encode('utf-8'))
        return base64.b64encode(salt + key).decode('utf-8')
    
    def _verify_password(self, password: str, stored_hash: str) -> bool:
        """Verify password against stored hash"""
        try:
            stored_bytes = base64.b64decode(stored_hash.encode('utf-8'))
            salt = stored_bytes[:32]
            stored_key = stored_bytes[32:]
            
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000
            )
            
            try:
                kdf.verify(password.encode('utf-8'), stored_key)
                return True
            except:
                return False
        except:
            return False
    
    def _generate_jwt_token(self, user_id: str, email: str) -> str:
        """Generate JWT token for user"""
        payload = {
            'sub': user_id,
            'email': email,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=24),
            'aud': 'authenticated',
            'role': 'authenticated'
        }
        
        return jwt.encode(payload, self.jwt_secret, algorithm='HS256')

# Global auth instance
supabase_auth: Optional[SupabaseAuthReplacement] = None

async def initialize_supabase_auth(db_url: str, jwt_secret: str, supabase_url: str):
    """Initialize the Supabase auth replacement"""
    global supabase_auth
    supabase_auth = SupabaseAuthReplacement(db_url, jwt_secret, supabase_url)
    await supabase_auth.initialize()

# Compatibility functions for existing code
async def create_user(email: str, password: str, **kwargs):
    """Create user - gotrue compatibility"""
    if not supabase_auth:
        raise RuntimeError("Supabase auth not initialized")
    return await supabase_auth.create_user(email, password, kwargs)

async def sign_in_with_password(email: str, password: str):
    """Sign in with password - gotrue compatibility"""
    if not supabase_auth:
        raise RuntimeError("Supabase auth not initialized")
    return await supabase_auth.sign_in_with_password(email, password)

async def get_user(token: str):
    """Get user from token - gotrue compatibility"""
    if not supabase_auth:
        raise RuntimeError("Supabase auth not initialized")
    return await supabase_auth.get_user(token)

async def sign_out(token: str):
    """Sign out user - gotrue compatibility"""
    if not supabase_auth:
        raise RuntimeError("Supabase auth not initialized")
    return await supabase_auth.sign_out(token)