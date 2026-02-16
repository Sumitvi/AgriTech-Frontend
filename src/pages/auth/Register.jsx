import { useForm } from "react-hook-form";
import { registerUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      alert("Registration Successful");
      navigate("/login");
    } catch (err) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 shadow-lg rounded-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register Account
        </h2>

        {/* Name */}
        <input
          {...register("name")}
          placeholder="Full Name"
          className="border p-2 w-full mb-3 rounded"
        />

        {/* Mobile */}
        <input
          {...register("mobile")}
          placeholder="Mobile Number"
          className="border p-2 w-full mb-3 rounded"
        />

        {/* Email */}
        <input
          {...register("email")}
          placeholder="Email Address"
          className="border p-2 w-full mb-3 rounded"
        />

        {/* Password */}
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3 rounded"
        />

        {/* Role Selection */}
        <select
          {...register("role")}
          className="border p-2 w-full mb-4 rounded"
        >
          <option value="">Select Role</option>
          <option value="ROLE_FARMER">Farmer</option>
          <option value="ROLE_TRADER">Trader</option>
          <option value="ROLE_STORE_OWNER">Store Owner</option>
          {/* <option value="ROLE_ADMIN">Admin</option> */}
        </select>

        <button className="bg-green-600 hover:bg-green-700 text-white p-2 w-full rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
