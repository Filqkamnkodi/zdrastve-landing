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
  { name: "Д-р Тереза Стоева Чолакова", image: doctorFemale, bio: placeholderBio },
  { name: "Д-р Специалист", image: doctorThird, bio: placeholderBio },
  { name: "Медицинска сестра", image: nurseOne, bio: placeholderBio },
  { name: "Медицински специалист", image: nurseTwo, bio: placeholderBio },
];
