const MollitiaPrometheus = require('@mollitia/prometheus')
const Mollitia = require('mollitia')

export const { Circuit, Fallback, SlidingCountBreaker, BreakerState } = Mollitia

Mollitia.use(new MollitiaPrometheus.PrometheusAddon())

const config = {
    name: 'appCounter',
    slidingWindowSize: 6, // Failure Rate Calculation is done on the last 6 iterations
    minimumNumberOfCalls: 3, // 3 iterations are needed to start calculating the failure rate, and see if circuit should be opened or not
    failureRateThreshold: 60, // If half of the iterations or more are failing, the circuit is switched to Opened state.
    slowCallDurationThreshold: 500, // An iteration is considered as being slow if the iteration lasts more than 1s
    slowCallRateThreshold: 50, // If at least 80% of the iterations are considered as being slow, the circuit is switched to Opened state.
    permittedNumberOfCallsInHalfOpenState: 2, // When the circuit is in Half Opened state, the circuit accepts 2 iterations in this state.
    openStateDelay: 10000, // The circuit stays in Opened state for 10s
    halfOpenStateMaxDelay: 30000,
}

export const slidingCountBreaker = new SlidingCountBreaker(config)

export const fallback = new Fallback({
    callback(err: any) {
        // Every time the method rejects, You can filter here
        if (err) {
            return err.message
        }
    },
})

// Creates a circuit
export const circuitBreaker = new Circuit({
    name: 'Order Operations',
    options: {
        prometheus: {
            name: 'orderCircuit',
        },
        modules: [slidingCountBreaker, fallback],
    },
})




