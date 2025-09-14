"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "./SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import Image from "next/image";
import { SelectItem } from "../ui/select";
import FileUploader from "../FileUploader";
import { registerPatient } from "@/lib/actions/patient.actions";

const RegisterForm = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    // @ts-ignore
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values : z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    let formData;

      if (values.identificationDocument && values.identificationDocument.length > 0) {
        const blobFile = new Blob([values.identificationDocument[0]] , {
          type: values.identificationDocument[0].type
        })

        formData = new FormData()
        formData.append('blobFile', blobFile)
        formData.append("fileName" , values.identificationDocument[0].name)
      }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      }

      // @ts-ignore
      const patient = await registerPatient(patientData)

      if(patient) router.push(`/patients/${user.$id}/new-appointment`)
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false)
  }

  return (
    <>
      <Form {...form}>
        <form
        // @ts-ignore
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-12 flex-1"
        >
          <section className="space-y-4">
            <h1 className="header">Welcome</h1>
            <p className="text-dark-700">Let us know more about yourself.</p>
          </section>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Personal Information</h2>
            </div>
          </section>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Full Name"
            name="name"
            placeholder="Ali Amini"
            iconSrc="/icons/user.svg"
            iconAlt="user"
          />

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Email"
              name="email"
              placeholder="Ali@gmial.com"
              iconSrc="/icons/email.svg"
              iconAlt="email"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              label="Number"
              name="phone"
              placeholder="0912......"
              iconSrc="/icons/phone.svg"
              iconAlt="number"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              label="Date of birth"
              name="birthDate"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              label="Gender"
              name="gender"
              renderSkeleton={(field) => {
                return (
                  <FormControl>
                    <RadioGroup
                      className="flex h-11 gap-6 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {GenderOptions.map((option) => (
                        <div key={option} className="radio-group">
                          <RadioGroupItem value={option} id={option} />
                          <Label className="cursor-pointer" htmlFor={option}>
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                );
              }}
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Address"
              name="address"
              placeholder="14th Street, New York"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Occupation"
              name="occupation"
              placeholder="Engineer"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Emergency contact name"
              name="emergencyContactName"
              placeholder="Guardian's name"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.PHONE_INPUT}
              label="Emergency contact number"
              name="emergencyContactNumber"
              placeholder="0912......"
            />
          </div>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Medical Information</h2>
            </div>
          </section>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Primary care physician"
            placeholder="Select a physician"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Insurance provider"
              name="insuranceProvider"
              placeholder="BlueCross BlueShield"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Insurance policy number"
              name="insurancePolicyNumber"
              placeholder="ABC123649"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              label="Allergies"
              name="allergies"
              placeholder="Peanuts , Penecillin , ..."
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              label="Currrent medication"
              name="currentMedication"
              placeholder="Aspirin"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              label="Family medical history"
              name="familyMedicalHistory"
              placeholder="Father had heart disease"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              label="Past medical history"
              name="pastMedicalHistory"
              placeholder="Appendectomy"
            />
          </div>

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Identification and Verification</h2>
            </div>
          </section>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification type"
            placeholder="Select an identification type"
          >
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Identification number"
            name="identificationNumber"
            placeholder="1364985"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            label="Scaned copy of identification document"
            name="identificationDocument"
            renderSkeleton={(field) => {
              return (
                <FormControl>
                  <FileUploader files={field.value} onChange={field.onChange} />
                </FormControl>
              );
            }}
          />

          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Consent and Privacy</h2>
            </div>
          </section>

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to treatment"
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to disclosure of information"
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I consent to privacy policy"
          />

          <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
        </form>
      </Form>
    </>
  );
};

export default RegisterForm;
