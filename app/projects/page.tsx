import { permanentRedirect } from 'next/navigation';

export default function ProjectsIndexRedirect() {
  permanentRedirect('/work');
}
