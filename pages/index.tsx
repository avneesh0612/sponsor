import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
const stripePromise = loadStripe(process.env.stripe_public_key!);
import data from "../public/data.json";

import { CheckoutCard } from "../components";

export default function Home() {
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
    <div className="relative flex min-h-screen w-screen flex-col-reverse items-center bg-darkBlue p-10 sm:flex-row sm:justify-evenly sm:p-20">
      <Head>
        <link rel="icon" href="/icon.svg" />
      </Head>
      <div className="absolute bottom-0 mt-10 h-28 w-screen rounded-b-lg bg-darkerBlue sm:h-40"></div>
      <div className="mt-20 mb-12 sm:-mb-24 sm:mt-0">
        <Image
          src="/Illustration.svg"
          alt="logo"
          width={500}
          height={430}
          objectFit="contain"
        />
      </div>

      <div className="flex w-screen flex-col items-center sm:h-auto sm:w-auto sm:items-start">
        <div className="relative h-16 w-60">
          <Image src="/logo.svg" alt="logo" layout="fill" objectFit="contain" />
        </div>
        <CheckoutCard
          amount={amount}
          loading={loading}
          data={data}
          defaultAmounts={defaultAmounts}
          setLoading={setLoading}
          setAmount={setAmount}
          createCheckoutSession={createCheckOutSession}
        />
      </div>
    </div>
  );
}
