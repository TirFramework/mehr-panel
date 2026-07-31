import { DatePicker } from "antd";
import jalaliGenerateConfig from "../lib/jalaliGenerateConfig";

const JalaliDatePicker = DatePicker.generatePicker(jalaliGenerateConfig);

export default JalaliDatePicker;
