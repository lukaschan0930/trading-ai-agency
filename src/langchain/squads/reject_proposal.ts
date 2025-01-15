import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";

export class SolanaRejectProposal2by2Multisig extends Tool {
  name = "reject_proposal_2by2_multisig";
  description = `Reject a proposal to transfer funds from a 2-of-2 multisig account on Solana with the user and the agent, where both approvals will be required to run the transactions.
  
  If proposalIndex is not provided, the latest index will automatically be fetched and used.

  Inputs (JSON string):
  - proposalIndex: number, the index of the proposal (optional).`;

  constructor(private solanaKit: SolanaAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const inputFormat = JSON.parse(input);
      const proposalIndex = inputFormat.proposalIndex ?? undefined;

      const tx = await this.solanaKit.rejectMultisigProposal(proposalIndex);

      return JSON.stringify({
        status: "success",
        message: "Proposal rejected successfully",
        transaction: tx,
        proposalIndex: proposalIndex.toString(),
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "REJECT_PROPOSAL_2BY2_MULTISIG_ERROR",
      });
    }
  }
}
