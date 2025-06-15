import React,{ useEffect } from "react";

const plans = [
  {
    name: 'Mobile',
    amount: 14900, // in paise
    displayPrice: '₹149',
    resolution: '480p',
    quality: 'Fair',
    devices: 'Mobile phone, tablet',
    streams: 1,
    downloads: 1,
    color: 'from-blue-600 to-blue-900',
  },
  {
    name: 'Basic',
    amount: 19900,
    displayPrice: '₹199',
    resolution: '720p (HD)',
    quality: 'Good',
    devices: 'TV, computer, mobile phone, tablet',
    streams: 1,
    downloads: 1,
    tag: 'Most Popular',
    color: 'from-purple-600 to-purple-900',
  },
  {
    name: 'Standard',
    amount: 49900,
    displayPrice: '₹499',
    resolution: '1080p (Full HD)',
    quality: 'Great',
    devices: 'TV, computer, mobile phone, tablet',
    streams: 2,
    downloads: 2,
    color: 'from-pink-500 to-purple-700',
  },
  {
    name: 'Premium',
    amount: 64900,
    displayPrice: '₹649',
    resolution: '4K (Ultra HD) + HDR',
    quality: 'Best',
    devices: 'TV, computer, mobile phone, tablet',
    streams: 4,
    downloads: 6,
    spatialAudio: true,
    color: 'from-red-500 to-purple-900',
  },
];

function SubscriptionPlans() {

    useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // const amount = 500;
  // const currency = "INR";
  // const receiptId = "qwsaq1";

  const paymentHandler = async (amount, planName) => {
    const response = await fetch(`${import.meta.env.VITE_REACT_APP}/order`, {
      method: "POST",
      body: JSON.stringify({
        amount,
       currency: 'INR',
        receipt: `receipt_${planName}_${Date.now()}`,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    console.log(order);

    var options = {
      key: "rzp_test_E9SfEg9J3D0ITS", // Enter the Key ID generated from the Dashboard
      amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: 'INR',
      name: 'PixyBox', //your business name
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        const body = {
          ...response,
        };

        const validateRes = await fetch(
          `${import.meta.env.VITE_REACT_APP}/order/validate`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonRes = await validateRes.json();
        console.log(jsonRes);

          // Save plan info in localStorage
        localStorage.setItem("planName", planName);
        const planColor = plans.find(p => p.name === planName)?.color;
        localStorage.setItem("planColor", planColor);

        alert(`Payment for ${planName} successful!`);

      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: "Ayan De", //your customer's name
        email: "deayan@example.com",
        contact: "9000000000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#E50914",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    // e.preventDefault();
  };

  return (
<div className="bg-gray-900 text-white py-10 px-5">
      <h2 className="text-center text-2xl font-bold mb-6">Choose Your Plan</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`w-72 p-5 rounded-xl bg-gradient-to-tr ${plan.color} shadow-md transition-transform hover:scale-105`}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              {plan.tag && (
                <span className="text-xs bg-white text-black px-2 py-0.5 rounded">
                  {plan.tag}
                </span>
              )}
            </div>
            <p className="text-lg font-semibold">{plan.displayPrice}/month</p>
            <p className="text-sm mt-2">Resolution: {plan.resolution}</p>
            <p className="text-sm">Video & Sound: {plan.quality}</p>
            {plan.spatialAudio && <p className="text-sm">Spatial Audio: Included</p>}
            <p className="text-sm">Devices: {plan.devices}</p>
            <p className="text-sm">Screens: {plan.streams}</p>
            <p className="text-sm mb-4">Download devices: {plan.downloads}</p>
            <button
              onClick={() => paymentHandler(plan.amount, plan.name)}
              className="bg-white text-black font-semibold py-2 w-full rounded hover:bg-gray-300"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionPlans;
