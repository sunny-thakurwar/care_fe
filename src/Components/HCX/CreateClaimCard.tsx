import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CareIcon from "../../CAREUI/icons/CareIcon";
import { getConsultation, HCXActions } from "../../Redux/actions";
import * as Notification from "../../Utils/Notifications";
import { classNames, formatCurrency } from "../../Utils/utils";
import ButtonV2, { Submit } from "../Common/components/ButtonV2";
import ClaimsItemsBuilder from "./ClaimsItemsBuilder";
import { HCXClaimModel, HCXPolicyModel, HCXItemModel } from "./models";
import HCXPolicyEligibilityCheck from "./PolicyEligibilityCheck";
import PROCEDURES from "../../Common/procedures";
import DialogModal from "../Common/Dialog";
import PatientInsuranceDetailsEditor from "./PatientInsuranceDetailsEditor";
import ClaimCreatedModal from "./ClaimCreatedModal";

interface Props {
  consultationId: string;
  patientId: string;
  setIsCreating: (creating: boolean) => void;
  isCreating: boolean;
  use?: "preauthorization" | "claim";
}

export function useKnownProcedureIfAvailable({ procedure }: any) {
  const knownProcedure = PROCEDURES.find((o) => o.code === procedure);

  if (knownProcedure) {
    return {
      id: knownProcedure.code,
      name: knownProcedure.name || knownProcedure.code,
      price: knownProcedure.price,
    };
  }

  return {
    id: procedure,
    name: procedure,
    price: 0.0,
  };
}

export default function CreateClaimCard({
  consultationId,
  patientId,
  setIsCreating,
  isCreating,
  use = "preauthorization",
}: Props) {
  const dispatch = useDispatch<any>();
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [policy, setPolicy] = useState<HCXPolicyModel>();
  const [items, setItems] = useState<HCXItemModel[]>();
  const [itemsError, setItemsError] = useState<string>();
  const [createdClaim, setCreatedClaim] = useState<HCXClaimModel>();

  useEffect(() => {
    async function autoFill() {
      const latestApprovedPreAuthsRes = await dispatch(
        HCXActions.preauths.list(consultationId)
      );

      if (latestApprovedPreAuthsRes.data?.results?.length) {
        // TODO: offload outcome filter to server side once payer server is back
        const latestApprovedPreAuth = (
          latestApprovedPreAuthsRes.data.results as HCXClaimModel[]
        ).find((o) => o.outcome === "Processing Complete");
        if (latestApprovedPreAuth) {
          setPolicy(latestApprovedPreAuth.policy_object);
          setItems(latestApprovedPreAuth.procedures);
          return;
        }
      }

      const res = await dispatch(getConsultation(consultationId as any));

      if (res.data && Array.isArray(res.data.procedure)) {
        setItems(res.data.procedure.map(useKnownProcedureIfAvailable));
      } else {
        setItems([{ id: "", name: "", price: 0 }]);
      }
    }

    autoFill();
  }, [consultationId, dispatch]);

  const validate = () => {
    if (!policy) {
      Notification.Error({ msg: "Please select a policy" });
      return false;
    }
    if (policy?.outcome !== "Processing Complete") {
      Notification.Error({ msg: "Please select an eligible policy" });
      return false;
    }
    if (!items || items.length === 0) {
      setItemsError("Please add at least one item");
      return false;
    }
    if (items?.some((p) => !p.id || !p.name || p.price === 0)) {
      setItemsError("Please fill all the item details");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsCreating(true);

    const res = await dispatch(
      HCXActions.claims.create({
        policy: policy?.id,
        procedures: items,
        consultation: consultationId,
        use,
      })
    );

    if (res.data) {
      Notification.Success({ msg: "Pre-authorization requested" });
      const makeClaimRes = await dispatch(HCXActions.makeClaim(res.data.id));

      if (makeClaimRes.status === 200 && makeClaimRes.data) {
        setItems([]);
      }
    } else {
      Notification.Error({ msg: "Failed to request pre-authorization" });
    }

    setCreatedClaim(res.data);
    setIsCreating(false);
  };

  return (
    <div className="flex flex-col gap-8">
      {createdClaim && (
        <ClaimCreatedModal
          show
          claim={createdClaim}
          onClose={() => setCreatedClaim(undefined)}
        />
      )}
      <DialogModal
        title="Edit Patient Insurance Details"
        show={showAddPolicy}
        onClose={() => setShowAddPolicy(false)}
        description="Add or edit patient's insurance details"
        className="w-full max-w-screen-md"
      >
        <PatientInsuranceDetailsEditor
          patient={patientId}
          onCancel={() => setShowAddPolicy(false)}
        />
      </DialogModal>
      {/* Check Insurance Policy Eligibility */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between pb-4">
          <h1 className="text-lg font-bold">
            Check Insurance Policy Eligibility
          </h1>
          <ButtonV2 onClick={() => setShowAddPolicy(true)} ghost border>
            <CareIcon className="care-l-edit-alt text-lg" />
            Edit Patient Insurance Details
          </ButtonV2>
        </div>
        <HCXPolicyEligibilityCheck
          patient={patientId}
          onEligiblePolicySelected={setPolicy}
        />
      </div>

      {/* Procedures */}
      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="font-bold text-left text-lg">Items</h1>
          <ButtonV2
            type="button"
            variant="alert"
            border
            ghost={items?.length !== 0}
            disabled={items === undefined || !policy}
            onClick={() =>
              setItems([...(items || []), { name: "", id: "", price: 0 }])
            }
          >
            <CareIcon className="care-l-plus text-lg" />
            <span>Add Item</span>
          </ButtonV2>
        </div>
        <span
          className={classNames(
            policy ? "opacity-0" : "opacity-100",
            "text-gray-700 transition-opacity duration-300 ease-in-out"
          )}
        >
          Select a policy to add items
        </span>
        <ClaimsItemsBuilder
          disabled={items === undefined || !policy}
          name="items"
          value={items}
          onChange={({ value }) => setItems(value)}
          error={itemsError}
        />
        <div className="place-self-end pr-8">
          {"Total Amount: "}
          {items ? (
            <span className="font-bold tracking-wider">
              {formatCurrency(
                items.map((p) => p.price).reduce((a, b) => a + b, 0.0)
              )}
            </span>
          ) : (
            "--"
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <Submit
          disabled={items?.length === 0 || !policy || isCreating}
          onClick={handleSubmit}
        >
          {isCreating && <CareIcon className="care-l-spinner animate-spin" />}
          {isCreating
            ? `Requesting ${use === "claim" ? "Claim" : "Pre-Authorization"}...`
            : `Request ${use === "claim" ? "Claim" : "Pre-Authorization"}`}
        </Submit>
      </div>
    </div>
  );
}