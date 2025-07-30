import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    grp_type: { type: String, required: true, enum: ['organisation', 'admin'], default: 'admin' },
    organisation_type: {
      type: String,
      required: function() {
        return this.grp_type === 'organisation';
      },
      enum: ['Private Limited', 'Government', 'NGO', 'Educational', 'Healthcare', 'Non-profit', 'Other']
    },
    email: { type: String, required: true },
    contact_no: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: function() {
        return this.grp_type === 'organisation';
      },
      trim: true
    },
    status: {
      type: String,
      enum: ['unverified', 'active', 'blocked'],
      default: 'unverified'
    },
    gst_no: { type: String, required: false },
    pan_no: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    id_proof: { type: String, required: true },
    bank_check: { type: String, required: false },
    company_certificate: { 
      type: String,
      required: function() {
        return this.grp_type === 'organisation';
      }
    },
    company_logo: {
      type: String,
      required: function() {
        return this.grp_type === 'organisation';
      }
    }
  },
  {
    timestamps: true, 
  }
);

const Group = mongoose.model('Group', groupSchema);
export default Group;
