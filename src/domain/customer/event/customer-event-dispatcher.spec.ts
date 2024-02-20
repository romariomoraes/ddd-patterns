import Address from "../entity/value-object/address";
import Customer from "../entity/customer";
import CustomerChangedAddressEvent from "./customer-changed-address.event";
import CustomerCreatedEvent from "./customer-created.event";
import CustomerChangedAddressHandler from "./handler/customer-changed-address.handler";
import CustomerCreatedSendEmailHandler from "./handler/customer-created-send-email.handler";
import CustomerCreatedHandler from "./handler/customer-created.handler";
import EventDispatcher from "../../@shared/event/event-dispatcher";

describe("Domain events tests", () => {
    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new CustomerCreatedHandler();

        eventDispatcher.register("CustomerCreatedHandler", eventHandler);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedHandler"]
        ).toBeDefined();
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedHandler"].length
        ).toBe(1);
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedHandler"][0]
        ).toMatchObject(eventHandler);
    });

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new CustomerCreatedHandler();

        eventDispatcher.register("CustomerCreatedHandler", eventHandler);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedHandler"][0]
        ).toMatchObject(eventHandler);

        eventDispatcher.unregister("CustomerCreatedHandler", eventHandler);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedHandler"]
        ).toBeDefined();
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedHandler"].length
        ).toBe(0);
    });

    it("should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new CustomerCreatedHandler();

        eventDispatcher.register("CustomerCreatedHandler", eventHandler);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedHandler"][0]
        ).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedHandler"]
        ).toBeUndefined();
    });

    it("should notify all event handlers", () => {
        
        const eventDispatcher = new EventDispatcher();
        const eventHandlerCustomerCreated = new CustomerCreatedHandler();
        const eventHandlerCustomerCreatedSendEmail = new CustomerCreatedSendEmailHandler();
        const eventHandlerCustomerChangedAddress = new CustomerChangedAddressHandler();
        const spyEventHandler1 = jest.spyOn(eventHandlerCustomerCreated, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandlerCustomerChangedAddress, "handle");
        const spyEventHandler3 = jest.spyOn(eventHandlerCustomerCreatedSendEmail, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandlerCustomerCreated);
        eventDispatcher.register("CustomerChangedAddressEvent", eventHandlerCustomerChangedAddress);
        eventDispatcher.register("CustomerCreatedEvent", eventHandlerCustomerCreatedSendEmail);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
        ).toBeDefined();
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
        ).toBe(2);
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandlerCustomerCreated);
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(eventHandlerCustomerCreatedSendEmail); 
        
        expect(
            eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]
        ).toBeDefined();
        expect(
            eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
        ).toMatchObject(eventHandlerCustomerChangedAddress);

        const customer = new Customer('1', 'romario');
        const customerCreatedEvent = new CustomerCreatedEvent(customer);
        eventDispatcher.notify(customerCreatedEvent);
        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler3).toHaveBeenCalled();

        const address = new Address('street', 1, 'zip', 'city');
        customer.changeAddress(address);
        const customerChangedAddressEvent = new CustomerChangedAddressEvent(customer);
        
        // Quando o notify for executado o CustomerCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(customerChangedAddressEvent);
        expect(spyEventHandler2).toHaveBeenCalled();
    });
});
