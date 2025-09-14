
import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";

export default async function NewAppointment({params : {userId}}: SearchParamProps) {
    const patient = await getPatient(userId);
  return (
    <div className="flex h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/icons/Logo.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <AppointmentForm type="create" userId={userId} patientId={patient.$id} />

          <p className="copyright mt-10 py-12">
            © 2024 CarePulse
          </p>
        </div>
      </section>

      <Image
        src="/images/appointment.png"
        height={1000}
        width={1000}
        className="side-img max-w-[390px] bg-bottom"
        alt="appointment"
      />
    </div>
  );
}
