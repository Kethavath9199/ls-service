import { Logger } from "../../../logger/logger";
import { DI } from "../../../di/diContainer";
import { Dispatch} from "../dto/dispatch.dto";
import { Shipment } from "../dto/shipment.dto";


export class DispatchDataTransformerService {
    private readonly logger: Logger;
    constructor() {
        this.logger = DI.get<Logger>(Logger)
    }

    transformExcelDispatchDataForShipmentRegistration(data: Dispatch): Shipment {
        try {
            const shipmentData: Shipment = {
                shipmentRegistrationType: 'byContainer',
                shipmentMode: 'INTERMODAL_SHIPMENT',
                mode: '',
                carrierName: data.shipment.carrierName,
                shipmentReferenceNo: '',
                containerNumber: data.shipment.containerNumber,
                awbNumber: data.shipment.awb,
                hawbNumber: data.shipment.hawb,
                invoiceNumber: data.invoiceNumber,
                bookingNumber: '',
                mblNumber: data.shipment.mbl,
                hblNumber: data.shipment.hbl,
                incoTerms: data.incoTerms,
                shipperName: '',
                consigneeName: '',
                actualETA: '',
                totalPack: '',
                packUOM: '',
                totalWeight: '',
                weightUOM: '',
                totalVolume: '',
                volumeUOM: '',
                vesselImo: '',
                vesselMmsi: '',
                portOfOrigin: '',
                portOfDestination: '',
                identifier: '',
                email: '',
                notify: []
            }

            return shipmentData;
        } catch (err) {

            throw err;
        }
    }
}