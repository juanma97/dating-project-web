export interface Event {
  id: string; // uuid
  title: string;
  description: string | null;
  date: string; // date format YYYY-MM-DD
  time: string | null; // time without time zone
  city: string | null;
  place: string | null;
  source: string | null;
  source_url: string | null;
  image: string | null;
  created_at: string | null; // timestamp with time zone
  street_name: string | null;
  street_number: number | null;
  organizer: string | null;
  min_age: number | null; // smallint
  max_age: number | null; // smallint
  girls_price: number | null; // real
  boys_price: number | null; // real
  sexual_orientation: string | null;
}
