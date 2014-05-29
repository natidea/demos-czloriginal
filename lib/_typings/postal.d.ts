
/** 
 * Postal.js object
 */
interface PostalStatic
{
    /**
     * Return a channel by name or the default channel
     */
    channel(name?:string): ChannelDefinition;
}

interface ChannelDefinition
{
    /* The channel name */
    channel: string;

    subscribe(topic: string, callback: (data?: any, envelope?: EnvelopeDefinition) => void): SubscriptionDefinition;

    publish(topic: string, data?: any): EnvelopeDefinition;

    publish(envelope: EnvelopeDefinition): EnvelopeDefinition;
}

interface SubscriptionDefinition
{
    channel: string;

    topic: string;

    callback(data?: any, envelope?: EnvelopeDefinition): void;

    context: any;

    subscribe(callback:any);

    unsubscribe();
}

interface EnvelopeDefinition
{
    channel: string;

    topic: string;

    timestamp?: string;

    data?: any;
}

declare module "postal" {
    export = postal;
}
//declare var postal: any; 
declare var postal: PostalStatic; 
