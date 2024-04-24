export interface Shipment {
    shipmentRegistrationType: 'byContainer' | 'byAWB';
    shipmentMode: 'AIR_SHIPMENT' | 'INTERMODAL_SHIPMENT';
    mode?: string;
    carrierName: string;
    shipmentReferenceNo?: string;
    containerNumber?: string;
    awbNumber?: string;
    hawbNumber?: string;
    invoiceNumber: string;
    bookingNumber?: string;
    mblNumber?: string;
    hblNumber?: string;
    incoTerms?: string;
    shipperName: string;
    consigneeName: string;
    actualETA?: string;
    totalPack?: string;
    packUOM?: string;
    totalWeight?: string;
    weightUOM?: string;
    totalVolume?: string;
    volumeUOM?: string;
    vesselImo?: string;
    vesselMmsi?: string;
    portOfOrigin?: string;
    portOfDestination?: string;
    identifier?: string;
    email?: string;
    notify?: Array<notify>;
}

interface notify {
    identifier: string,
    email: string
}
