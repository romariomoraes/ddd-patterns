import Address from "../../../entity/address";
import Customer from "../../../entity/customer";
import CustomerChangedAddressEvent from "../../customer/customer-changed-address.event";
import CustomerCreatedSendEmailEvent from "../../customer/customer-created-send-email.event";
import CustomerCreatedEvent from "../../customer/customer-created.event";
import CustomerChangedAddressHandler from "../../customer/handler/customer-changed-address.handler";
import CustomerCreatedSendEmailHandler from "../../customer/handler/customer-created-send-email.handler";
import CustomerCreatedHandler from "../../customer/handler/customer-created.handler";
import EventDispatcher from "../event-dispatcher";

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
        eventDispatcher.register("CustomerCreatedSendEmailEvent", eventHandlerCustomerCreatedSendEmail);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
        ).toBeDefined();
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandlerCustomerCreated);
        
        expect(
            eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]
        ).toBeDefined();
        expect(
            eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
        ).toMatchObject(eventHandlerCustomerChangedAddress);
        
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedSendEmailEvent"]
        ).toBeDefined();
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedSendEmailEvent"][0]
        ).toMatchObject(eventHandlerCustomerCreatedSendEmail);

        const customer = new Customer('1', 'romario');
        const customerCreatedEvent = new CustomerCreatedEvent(customer);
        eventDispatcher.notify(customerCreatedEvent);
        expect(spyEventHandler1).toHaveBeenCalled();

        const customerCreatedSendEmailEvent = new CustomerCreatedSendEmailEvent(customer);
        eventDispatcher.notify(customerCreatedSendEmailEvent);
        expect(spyEventHandler3).toHaveBeenCalled();

        const address = new Address('street', 1, 'zip', 'city');
        customer.changeAddress(address);
        const customerChangedAddressEvent = new CustomerChangedAddressEvent(customer);
        
        // Quando o notify for executado o CustomerCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(customerChangedAddressEvent);
        expect(spyEventHandler2).toHaveBeenCalled();
    });
});
