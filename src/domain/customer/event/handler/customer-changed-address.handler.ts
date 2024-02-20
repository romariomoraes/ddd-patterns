import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangedAddressEvent from "../customer-changed-address.event";

export default class CustomerChangedAddressHandler
    implements EventHandlerInterface<CustomerChangedAddressEvent>
{
    handle(event: CustomerChangedAddressEvent): void {
        console.log(`Customer Changed Address .....`);
    }
}
