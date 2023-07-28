import { Loader } from 'components/common';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';

const handlePayment = () => {
  const router = useRouter();
  const { data: session } = useSession();

  function submitData(router, session) {
    const postData = {
      payment_id: router.query.payment_id,

      payment_request_id: router.query.payment_request_id,

      payment_status: router.query.payment_status,
    };

    fetch(`${process.env.NEXT_PUBLIC_PAYMENT_PROCESS_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:
          session && session['access']?.token ? session['access'].token : '',
      },
      body: JSON.stringify(postData),
    }).then((res) => {
      if (res.status == 200) {
        router.push(`/user/my-datasets`);
      } else {
      }
    });
  }

  React.useEffect(() => {
    session && submitData(router, session);
  }, [router, session]);

  return (
    <>
      <Loader loadingText="Payment verification is in progress." />
    </>
  );
};

export default handlePayment;
