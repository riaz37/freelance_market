import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from './models/notification.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [Notification])
  async myNotifications(@Context() context) {
    const { user } = context.req;
    return this.notificationsService.getUserNotifications(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Notification)
  async markNotificationAsRead(@Args('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
