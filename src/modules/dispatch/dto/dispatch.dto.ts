export interface Dispatch extends DispatchHeader {
    materials: Array<DispatchLine>;
    shipment: DispatchShipment
}

export interface DispatchHeader {
    orderNumber: string;
    invoiceNumber: string;
    invoiceDate: Date;
    pickupLocation: string;
    pickupDate: Date;
    consigneeId: string;
    consigneeName: string;
    incoTerms: string;
    commodityType: string;
}

interface DispatchLine {
    materialId: string;
    materialName: string;
    materialCategory: string;
    materialDiscription: string;
    quantity: string;
    uom: string;
    hsCode: string;
    hsCodeDiscription: string;
    noOfPackages: string;
    packageType: string;
    packageWeight: string;
    length: string;
    width: string;
    height: string;
    specialInstructions: string;
    hzGoods: string;
    requestedDateOfDelivery: string;
}

export interface DispatchShipment {
    modeOfShipment: string;
    carrierId: string;
    carrierName: string;
    bookingReference: string;
    containerNumber?: string;
    hbl?: string;
    mbl?: string;
    awb?: string;
    hawb?: string;
    mawb?: string;
}

export interface DispatchExcelData extends DispatchLine, DispatchShipment {
}

interface Error<T> {
    errorExist: boolean;
    code: number;
    error: string;
}