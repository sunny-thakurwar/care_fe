import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CareIcon from "../../CAREUI/icons/CareIcon";
import { getConsultation, HCXActions } from "../../Redux/actions";
import * as Notification from "../../Utils/Notifications";
import { classNames } from "../../Utils/utils";
import ButtonV2, { Submit } from "../Common/components/ButtonV2";
import ClaimsProceduresBuilder from "./ClaimsProceduresBuilder";
import { HCXClaimModel, HCXPolicyModel, HCXProcedureModel } from "./models";
import HCXPolicyEligibilityCheck from "./PolicyEligibilityCheck";
import { SelectFormField } from "../Form/FormFields/SelectFormField";

interface Props {
  consultationId: string;
  patientId: string;
  onClaimCreated: (claim: HCXClaimModel) => void;
}

export default function CreateClaimCard({
  consultationId,
  patientId,
  onClaimCreated,
}: Props) {
  const dispatch = useDispatch<any>();
  const [policy, setPolicy] = useState<HCXPolicyModel>();
  const [procedures, setProcedures] = useState<HCXProcedureModel[]>();
  const [isCreating, setIsCreating] = useState(false);
  const [priority, setPriority] = useState("normal");
  const [use, setUse] = useState("preauthorization");
  const [type, setType] = useState("institutional");

  useEffect(() => {
    async function autoFillProceduresFromConsultation() {
      const res = await dispatch(getConsultation(consultationId as any));

      if (res.data && Array.isArray(res.data.procedure)) {
        setProcedures(
          res.data.procedure.map((p: any) => {
            return {
              id: p.procedure,
              name: p.procedure,
              price: 0.0,
            };
          })
        );
      } else {
        setProcedures([{ id: "", name: "", price: 0 }]);
      }
    }

    autoFillProceduresFromConsultation();
  }, [consultationId, dispatch]);

  const handleSubmit = async () => {
    if (procedures?.length === 0 || !policy) return;

    setIsCreating(true);

    // TODO: validate procedures

    const res = await dispatch(
      HCXActions.claims.create({
        policy: policy.id,
        procedures: procedures,
        consultation: consultationId,
        priority,
        use,
        type,
      })
    );

    if (res.data) {
      Notification.Success({ msg: "Claim created successfully" });
      onClaimCreated(res.data);
    } else {
      Notification.Error({ msg: "Failed to create claim" });
    }

    const makeClaimRes = await dispatch(HCXActions.makeClaim(res.data.id));

    if (makeClaimRes.status === 200 && makeClaimRes.data) {
      // TODO: reset form
    }

    setIsCreating(false);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Check Insurance Policy Eligibility */}
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">
          Check Insurance Policy Eligibility
        </h1>
        <HCXPolicyEligibilityCheck
          patient={patientId}
          onEligiblePolicySelected={setPolicy}
        />
      </div>

      {/* Procedures */}
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="font-bold text-left text-lg">Procedures</h1>
          <ButtonV2
            type="button"
            variant="alert"
            border
            ghost={procedures?.length !== 0}
            disabled={
              procedures === undefined ||
              !(policy?.outcome === "Processing Complete")
            }
            onClick={() =>
              setProcedures([
                ...(procedures || []),
                { name: "", id: "", price: 0 },
              ])
            }
          >
            <CareIcon className="care-l-plus text-lg" />
            <span>Add Procedure</span>
          </ButtonV2>
        </div>
        <span
          className={classNames(
            policy ? "opacity-0" : "opacity-100",
            "text-gray-700 transition-opacity duration-300 ease-in-out"
          )}
        >
          Select a policy to add procedures
        </span>
        <ClaimsProceduresBuilder
          disabled={procedures === undefined || !policy}
          name="procedures"
          value={procedures}
          onChange={({ value }) => setProcedures(value)}
        />
        <div className="place-self-end pr-8">
          {"Total Amount: "}
          {procedures ? (
            <span className="font-bold tracking-wider">
              INR {procedures.map((p) => p.price).reduce((a, b) => a + b, 0.0)}
            </span>
          ) : (
            "--"
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 justify-evenly">
          <SelectFormField
            required
            name="priority"
            label="Priority"
            errorClassName="hidden"
            className="w-full"
            options={[
              { id: "stat", text: "Immediately" },
              { id: "normal", text: "Normal" },
              { id: "deferred", text: "Deferred" },
            ]}
            optionValue={(option) => option.id as string}
            optionLabel={(option) => option.text}
            onChange={({ value }) => setPriority(value)}
            value={priority}
          />
          <SelectFormField
            required
            name="type"
            label="Type"
            errorClassName="hidden"
            className="w-full"
            options={[
              { id: "institutional", text: "Institutional" },
              { id: "oral", text: "Oral" },
              { id: "pharmacy", text: "Pharmacy" },
              { id: "professional", text: "Professional" },
              { id: "vision", text: "Vision" },
            ]}
            optionValue={(option) => option.id as string}
            optionLabel={(option) => option.text}
            onChange={({ value }) => setType(value)}
            value={type}
          />
          <SelectFormField
            required
            name="use"
            label="Use"
            errorClassName="hidden"
            className="w-full"
            options={[
              { id: "preauthorization", text: "Pre-Auth" },
              { id: "claim", text: "Claim" },
            ]}
            optionValue={(option) => option.id as string}
            optionLabel={(option) => option.text}
            onChange={({ value }) => setUse(value)}
            value={use}
            // disabled={!insuranceDetails}
          />
        </div>

        <Submit
          disabled={procedures?.length === 0 || !policy || isCreating}
          onClick={handleSubmit}
        >
          {isCreating && <CareIcon className="care-l-spinner animate-spin" />}
          {isCreating ? "Creating Claim..." : "Create Claim"}
        </Submit>
      </div>
    </div>
  );
}