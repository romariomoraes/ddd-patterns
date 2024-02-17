import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerCreatedSendEmailEvent from "../customer-created-send-email.event";

export default class CustomerCreatedSendEmailHandler
    implements EventHandlerInterface<CustomerCreatedSendEmailEvent>
{
    handle(event: CustomerCreatedSendEmailEvent): void {
        console.log(`Customer Created, send email welcome.....`);
    }
}
