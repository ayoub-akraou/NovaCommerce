import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector : Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get('roles', context.getHandler()) ?? []

        if(requiredRoles.length == 0) return true

        const request = context.switchToHttp().getRequest()
        const userRole: UserRole | undefined = request.user?.role 

        if(!userRole) return false

        return requiredRoles.includes(userRole)
    }
} 