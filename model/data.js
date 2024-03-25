import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  full_name: String,
  date_of_birth: Date,
  birth_location: String,
  nationality: String,
  hobbies: String,
  personal_goal: String,
  username: String,
  password: String,
});

const workInfoSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  personal_skill: String,
  personal_project_name: String,
  personal_project_description: String,
  personal_project_role: String,
  personal_project_start_date: Date,
  personal_project_finish_date: Date,
  work_progress_date_of_start: Date,
  work_progress_date_of_finish: Date,
  company_name: String,
  role: String
});

// Define models based on the schemas
const UserInfo = mongoose.model('UserInfo', userSchema);
const WorkInfo = mongoose.model('WorkInfo', workInfoSchema);

// Export models
export { UserInfo, WorkInfo };