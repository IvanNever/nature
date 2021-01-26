import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
    const stripe = Stripe(
        'pk_test_51IDnXgCzQwQ0j8gOJbf3FRQ46iv8Sb5AXNpASCe2E3Uta7QcCdDVnevbsyNynicg2qusBH5u3VxlgUbipdCujCoQ00MOXWf2bs'
    );
    try {
        // 1) Get checkout session from API
        const session = await axios(
            `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`
        );

        // 2) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
