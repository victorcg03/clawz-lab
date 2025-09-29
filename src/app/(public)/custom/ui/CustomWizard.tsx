'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Stepper } from '@/components/layout/ui/Stepper';
import { ContactStep } from './ContactStep';
import { DesignStep } from './DesignStep';
import { DescriptionStep } from './DescriptionStep';
import { InspirationStep } from './InspirationStep';
import { MeasurementStep } from './MeasurementStep';
import { SummaryStep } from './SummaryStep';
import { createCustomRequestAction } from '../actions';
import type {
  ContactData,
  DesignData,
  DescriptionData,
  InspirationData,
  MeasurementData,
  CustomRequestData,
} from '../schema';

const STEPS = [
  'Contacto',
  'Diseño',
  'Descripción',
  'Inspiración',
  'Medidas',
  'Resumen',
] as const;

interface WizardData {
  contact: Partial<ContactData>;
  design: Partial<DesignData>;
  description: Partial<DescriptionData>;
  inspiration: Partial<InspirationData>;
  measurement: Partial<MeasurementData>;
}

interface CustomWizardProps {
  userProfile?: {
    name: string;
    email: string;
    phone?: string;
  } | null;
}

export function CustomWizard({ userProfile }: Readonly<CustomWizardProps>) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [wizardData, setWizardData] = useState<WizardData>({
    contact: userProfile
      ? {
          contact_name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
        }
      : {},
    design: { colors: [], extras: [] },
    description: {},
    inspiration: { inspiration_urls: [] },
    measurement: {},
  });

  const updateWizardData = <T extends keyof WizardData>(
    step: T,
    data: Partial<WizardData[T]>,
  ) => {
    setWizardData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  };

  const goToNextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Combinar todos los datos del wizard
      const completeData: CustomRequestData = {
        ...wizardData.contact,
        ...wizardData.design,
        ...wizardData.description,
        ...wizardData.inspiration,
        ...wizardData.measurement,
      } as CustomRequestData;

      const result = await createCustomRequestAction(completeData);

      if (result.error) {
        setError(result.error);
      } else {
        // Redirigir a página de confirmación
        router.push(`/custom/success?id=${result.requestId}`);
      }
    } catch {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ContactStep
            data={wizardData.contact}
            onUpdate={(data) => updateWizardData('contact', data)}
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <DesignStep
            data={wizardData.design}
            onUpdate={(data) => updateWizardData('design', data)}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <DescriptionStep
            data={wizardData.description}
            onUpdate={(data) => updateWizardData('description', data)}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 4:
        return (
          <InspirationStep
            data={wizardData.inspiration}
            onUpdate={(data) => updateWizardData('inspiration', data)}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 5:
        return (
          <MeasurementStep
            data={wizardData.measurement}
            onUpdate={(data) => updateWizardData('measurement', data)}
            onNext={goToNextStep}
            onBack={goToPreviousStep}
          />
        );
      case 6:
        return (
          <SummaryStep
            data={wizardData}
            onBack={goToPreviousStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Encargo personalizado
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Completa los siguientes pasos para crear tu solicitud de uñas personalizadas.
            Te enviaremos un presupuesto detallado en las próximas 24 horas.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}
