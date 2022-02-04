import { FC } from "react";

import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
const stripePromise = loadStripe(process.env.stripe_public_key!);
import data from "../../public/data.json";

const CheckoutCard: FC = () => {
  const [amount, setAmount] = useState<number | null>(data.defaultAmounts[1]);
  const [loading, setLoading] = useState<boolean>(false);
  const defaultAmounts = data.defaultAmounts;

  const createCheckOutSession = async () => {
    setLoading(true);
    const stripe = await stripePromise;

    const checkoutSession = await axios.post("/api/create-checkout-session", {
      amount: amount,
    });

    const result = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result?.error) {
      alert(result?.error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="z-50 mt-10 flex w-[90vw] flex-col items-center space-y-5 rounded-md bg-darkerBlue p-10 px-5 shadow-xl sm:w-[436px] sm:px-10">
        <h2 className="font-ClashDisplay text-3xl font-semibold text-accent">
          Love what I do? Feel free to support me with a donation!
        </h2>
        <p className="text-[#E3E3E3]">
          Thanks in advance. Each donation of yours means a lot, however little
          it might be!
        </p>
        <div className="group flex w-full items-center rounded-lg bg-[#E9F9FA]/30 text-white focus:outline-none">
          <p className="rounded-l-lg bg-[#E7EAEA]/80 px-4 py-3 text-lg uppercase text-black opacity-80 transition duration-200 group-hover:opacity-100">
            {data?.currency}
          </p>
          <input
            type="number"
            value={amount ? amount : ""}
            className="w-full rounded-lg bg-transparent px-4 py-3 text-white opacity-80 transition duration-200 focus:outline-none group-hover:opacity-100"
            placeholder="Enter Amount"
            onChange={e => setAmount(parseInt(e.target.value))}
          />
        </div>
        <div className="flex w-full items-center space-x-2">
          {defaultAmounts.map(buttonAmount => (
            <button
              className={`${
                amount === buttonAmount ? "bg-accent" : "bg-[#E7EAEA]/80"
              }  rounded-full px-6 py-3 opacity-90 transition duration-200 hover:opacity-100`}
              onClick={() => setAmount(buttonAmount)}
              key={buttonAmount}
            >
              ₹{buttonAmount}
            </button>
          ))}
        </div>
        <button
          disabled={!amount || loading}
          onClick={createCheckOutSession}
          role="link"
          className={`group mt-4 flex w-full items-center justify-center rounded-lg border-2 border-accent bg-accent px-6 py-3 text-xl font-semibold transition duration-200 hover:border-accent hover:bg-transparent hover:text-accent ${
            amount || loading ? "" : "cursor-not-allowed opacity-50"
          }`}
        >
          {loading ? (
            <div
              style={{ borderTopColor: "transparent" }}
              className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-darkerBlue group-hover:border-accent"
              role="status"
            />
          ) : (
            <span>Sponsor</span>
          )}
        </button>
      </div>
    </>
  );
};

export default CheckoutCard;
