import doctorMale from "@/assets/doctor-cholakov.jpg";
import doctorFemale from "@/assets/doctor-cholakova.jpg";
import doctorThird from "@/assets/team-doctor-3.jpg";
import nurseOne from "@/assets/team-nurse-1.jpg";
import nurseTwo from "@/assets/team-nurse-2.jpg";

export type TeamMember = {
  name: string;
  image: string;
  bio: string;
};

export const placeholderBio =
  "Тук ще бъде публикувана подробна информация за биографията, специалностите, образованието и професионалния опит на специалиста.";

export const team: TeamMember[] = [
  { name: "Д-р Милен Русев Чолаков", image: doctorMale, bio: placeholderBio },
  { name: "Д-р Милен Миленов Чолаков\u00a0", image: doctorFemale, bio: placeholderBio },
  { name: "Д-р Симана Иванова", image: doctorThird, bio: placeholderBio },
  { name: "Мед. Сестра Емилия Райнова", image: nurseOne, bio: placeholderBio },
  { name: "Мед. Фелдшер Албена Мирова", image: nurseTwo, bio: placeholderBio },
];
