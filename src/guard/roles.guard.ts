import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "./interface/role.enum";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private refletor:Reflector){}

    canActivate(context: ExecutionContext):boolean{

      const requiredRoles = this.refletor.getAllAndOverride<Role[]>('roles',[context.getHandler(),context.getClass()])

      if(!requiredRoles){
        return true
      }

      const req = context.switchToHttp().getRequest()

      if(!req?.user?.role){
        return true
      }
      return requiredRoles.some( role => role === req.user.role )
    }
}