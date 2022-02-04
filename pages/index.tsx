import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
const stripePromise = loadStripe(process.env.stripe_public_key!);
import data from "../public/data.json";

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
    <div className="relative flex flex-col-reverse items-center w-screen min-h-screen p-10 sm:flex-row bg-darkBlue sm:p-20 sm:justify-evenly">
      <Head>
        <link rel="icon" href="/icon.svg" />
      </Head>
      <div className="absolute bottom-0 w-screen mt-10 rounded-b-lg h-28 sm:h-40 bg-darkerBlue"></div>
      <div className="mt-20 mb-12 sm:-mb-24 sm:mt-0">
        <Image
          src="/Illustration.svg"
          alt="logo"
          width={500}
          height={430}
          objectFit="contain"
        />
      </div>

      <div className="flex flex-col items-center w-screen sm:items-start sm:w-auto sm:h-auto">
        <div className="relative h-16 w-60">
          <Image src="/logo.svg" alt="logo" layout="fill" objectFit="contain" />
        </div>
        <div className="sm:w-[436px] w-[90vw] z-50 mt-10 flex flex-col space-y-5 shadow-xl rounded-md items-center px-5 sm:px-10 p-10 bg-white/10">
          <h2 className="text-3xl font-semibold font-ClashDisplay text-accent">
            Love what I do? Feel free to support me with a donation!
          </h2>
          <p className="text-[#E3E3E3]">
            Thanks in advance. Each donation of yours means a lot, however
            little it might be!
          </p>
          <div className="bg-[#E9F9FA]/30 group flex items-center focus:outline-none text-white rounded-lg w-full">
            <p className="bg-[#E7EAEA]/70 uppercase text-lg text-black rounded-l-lg px-4 py-3 opacity-80 group-hover:opacity-100 transition duration-200">
              {data.currency}
            </p>
            <input
              type="number"
              value={amount ? amount : ""}
              className="w-full px-4 py-3 text-white bg-transparent rounded-lg focus:outline-none opacity-80 group-hover:opacity-100 transition duration-200"
              placeholder="Enter Amount"
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
          </div>
          <div className="flex items-center w-full space-x-2">
            {defaultAmounts.map((buttonAmount) => (
              <button
                className={`${
                  amount === buttonAmount ? "bg-accent" : "bg-[#E7EAEA]/70"
                }  px-6 py-3 rounded-full opacity-80 hover:opacity-100 transition duration-200`}
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
            className={`bg-accent text-xl mt-4 font-semibold flex justify-center hover:bg-transparent hover:border-accent border-2 border-accent transition duration-200 hover:text-accent items-center w-full px-6 py-3 rounded-lg ${
              amount ? "" : "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <div
                style={{ borderTopColor: "transparent" }}
                className="inline-block w-6 h-6 border-4 border-solid rounded-full border-darkerBlue animate-spin"
                role="status"
              />
            ) : (
              <span>Sponsor</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
