from fastapi import Header, HTTPException

def require_role(required_role: str):
    def role_checker(x_role: str = Header(None)):
        if x_role != required_role:
            raise HTTPException(
                status_code=403,
                detail=f"Requires role: {required_role}"
            )
    return role_checker
