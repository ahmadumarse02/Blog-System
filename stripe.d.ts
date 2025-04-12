declare module "stripe" {
  namespace Stripe {
    interface Subscription {
      current_period_start: Date;
      current_period_end: Date;
    }
  }
}
