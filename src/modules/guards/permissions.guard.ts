import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const handler = context.getHandler();
        const permissions: any = this.reflector.get<any>('permissions', handler);
        if (!permissions) {
            return true;
        }

        const req = context.switchToHttp().getRequest();
        const user = req.user;

        const hasPermission = () => user.permissions.some((permission: any) => permissions.includes(permission));

        return user && user.permissions && hasPermission();
    }
}
