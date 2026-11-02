import { useState } from 'react';
import type { Product } from '@/lib/catalog';
import { daysFromNow } from '@/lib/delivery';
import type { Setup } from '@/lib/setup';
import ConfirmationStep from './confirmation-step';
import DeliveryStep, { type DeliveryDetails } from './delivery-step';
import ReviewStep from './review-step';

const DEFAULT_DELIVERY_LEAD_DAYS = 2;

type CheckoutContentProps = {
  setup: Setup;
  snapshot: string | null;
  onQuantityChange: (product: Product, quantity: number) => void;
  onRemove: (product: Product) => void;
  onClose: () => void;
};

/** Three steps: look over the setup, say where it's going, then make it real. */
export default function CheckoutContent({
  setup,
  snapshot,
  onQuantityChange,
  onRemove,
  onClose,
}: CheckoutContentProps) {
  const [step, setStep] = useState<'review' | 'delivery' | 'confirmed'>('review');
  const [delivery, setDelivery] = useState<DeliveryDetails>({
    area: 'Canggu',
    date: daysFromNow(DEFAULT_DELIVERY_LEAD_DAYS),
  });

  switch (step) {
    case 'review':
      return (
        <ReviewStep
          setup={setup}
          snapshot={snapshot}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
          onContinue={() => setStep('delivery')}
          onClose={onClose}
        />
      );
    case 'delivery':
      return (
        <DeliveryStep
          delivery={delivery}
          onChange={setDelivery}
          onBack={() => setStep('review')}
          onConfirm={() => setStep('confirmed')}
        />
      );
    case 'confirmed':
      return <ConfirmationStep setup={setup} snapshot={snapshot} delivery={delivery} />;
  }
}
