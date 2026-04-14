export const RETREAT_INCLUDED = [
  'Daily breathwork sessions',
  'Daily surf sessions with certified instructors',
  'Board rental and rash guards',
  '2 gourmet, healthy meals per day',
  'Beachfront accommodations',
  'Airport transportation',
  'Movement and recovery classes',
  'Guided nature immersion',
  'Opening and closing ceremonies',
  'Small group (max 12 guests)',
];

export const EXPERIENCE_INCLUDED = [
  '60-minute guided breathwork session',
  '2-hour surf lesson with certified guide',
  'Board and equipment rental',
  '1 shared, nourishing meal',
];

export const DEFAULT_PACKING_LIST = [
  'Swimsuit (2-3 recommended)',
  'Reef-safe sunscreen',
  'Light, breathable clothing',
  'Comfortable yoga/movement wear',
  'Journal and pen',
  'Reusable water bottle',
  'Hat and sunglasses',
  'Light sweater or hoodie for evenings',
  'Any personal medications',
  'Open heart and curious mind',
];

export const DEFAULT_DAILY_SCHEDULE = [
  { day: 1, title: 'Arrival & Opening', activities: ['Arrival and settle in', 'Welcome circle and introductions', 'Opening ceremony and intention setting', 'Shared dinner'] },
  { day: 2, title: 'Foundation', activities: ['Morning breathwork session', 'Surf lesson, ocean safety and fundamentals', 'Nourishing lunch', 'Afternoon nature walk', 'Evening reflection'] },
  { day: 3, title: 'Deepening', activities: ['Deeper breathwork practice', 'Surf session, building on foundations', 'Lunch', 'Movement and recovery class', 'Free time for journaling or rest'] },
  { day: 4, title: 'Integration', activities: ['Extended breathwork journey', 'Surf session, presence in the water', 'Lunch', 'Guided solo time in nature', 'Community dinner and sharing circle'] },
  { day: 5, title: 'Expression', activities: ['Morning breathwork, personal practice', 'Surf session, joy and play', 'Lunch', 'Creative expression or free surf', 'Celebration dinner'] },
  { day: 6, title: 'Closing & Departure', activities: ['Sunrise breathwork', 'Closing ceremony and integration guidance', 'Brunch', 'Departures with ongoing support plan'] },
];

export const DEFAULT_FAQS = [
  { question: 'Do I need surf experience?', answer: 'Not at all. Our retreats welcome all levels, from complete beginners to experienced surfers. Our certified instructors tailor each session to your skill level, and the breathwork practice enhances your connection to the ocean regardless of experience.', category: 'retreats' },
  { question: 'What\'s the food like?', answer: 'We serve gourmet, healthy meals made with fresh, local ingredients. Every meal is designed to nourish your body and support your practice. We accommodate all dietary needs including vegetarian, vegan, gluten-free, and any allergies. Just let us know in your guest profile.', category: 'retreats' },
  { question: 'Is it safe to travel there solo?', answer: 'Absolutely. Most of our guests come solo, and that\'s part of the beauty. You\'ll connect with a community of like-minded people from day one. All our locations are carefully chosen for safety, and our team handles all logistics from airport pickup to daily activities.', category: 'travel' },
  { question: 'What if I\'m not flexible or fit enough?', answer: 'Alua is for all body types and fitness levels. Our breathwork and movement practices meet you exactly where you are. Surfing is more about presence and connection than athleticism. We\'ll work with your body, not against it.', category: 'retreats' },
  { question: 'What is breathwork?', answer: 'Breathwork is a practice of conscious, intentional breathing that supports physical, mental, and emotional wellbeing. At Alua, we primarily use a 3-part active breathing technique rooted in pranayama tradition. It can help release tension, process emotions, build energy, and cultivate deep presence.', category: 'general' },
  { question: 'How is Alua different from other surf retreats?', answer: 'Unlike typical surf schools focused only on technique, we weave breathwork and surfing together as integrated healing modalities. The breath and grounded presence are central to both the instruction and the overall experience. This isn\'t a vacation, it\'s a container for genuine transformation.', category: 'general' },
  { question: 'What\'s the cancellation policy?', answer: 'Full refund for cancellations 60+ days before the retreat start date. 50% refund for 30-60 days. No refund for cancellations less than 30 days before. We understand plans change, so reach out if you have special circumstances.', category: 'booking' },
  { question: 'Can I extend my stay?', answer: 'We love when guests want to stay longer! Depending on availability and location, we can often help arrange extended accommodations. Let us know when you book or reach out anytime.', category: 'booking' },
  { question: 'What should I pack?', answer: 'Pack light: swimsuits, reef-safe sunscreen, breathable clothing, comfortable yoga wear, a journal, and a reusable water bottle. We provide all surf equipment, yoga mats, and anything you need for practice. A full packing list is sent in your pre-arrival email.', category: 'travel' },
  { question: 'Is the online studio the same as the retreat experience?', answer: 'The online studio offers live and recorded breathwork practices that complement and extend the retreat experience. While nothing replaces being in the ocean and in community, the studio helps you maintain your practice between retreats and integrate what you\'ve learned.', category: 'studio' },
  { question: 'Do you offer men\'s-only retreats?', answer: 'Yes, we offer specific men\'s retreats designed to create a unique container for masculine healing, growth, and brotherhood. Check our retreat calendar for upcoming dates.', category: 'retreats' },
  { question: 'What if the weather is bad?', answer: 'We plan meticulously, then hold that plan loosely. If conditions aren\'t right for surfing, we adapt with indoor breathwork, movement classes, local excursions, or rest. The ocean teaches us about surrender and flexibility, and that starts with how we design each day.', category: 'retreats' },
  { question: 'How do I prepare for a retreat?', answer: 'We send a preparation guide 30 days before your retreat with everything you need to know. If you\'re new to breathwork, try a session in our online studio beforehand. Most importantly, arrive with an open heart and willingness to slow down.', category: 'retreats' },
  { question: 'Are there age restrictions?', answer: 'Our retreats are designed for adults 18 and over. Our ideal community is ages 25-45, but we welcome anyone who resonates with our mission and values.', category: 'general' },
  { question: 'What ongoing support do you offer after a retreat?', answer: 'Every retreat graduate receives a personalized integration plan, access to our online studio, and continued community connection. The transformation doesn\'t end when you leave. We\'re here to support your ongoing practice.', category: 'general' },
];

export const DEFAULT_EMAIL_TEMPLATES = [
  {
    template_type: 'booking_confirmation',
    subject: 'Your Alua {{booking_type}} is confirmed',
    body: 'Hi {{guest_name}},\n\nThank you for booking your {{booking_type}} with Alua. We\'re honored you\'re joining us.\n\n{{booking_details}}\n\nYou\'ll receive preparation information as your dates approach. In the meantime, if you haven\'t already, please complete your guest profile so we can accommodate any dietary needs or preferences.\n\nWith gratitude,\nThe Alua Team',
  },
  {
    template_type: 'pre_arrival_30d',
    subject: 'Your Alua retreat is 30 days away',
    body: 'Hi {{guest_name}},\n\nYour retreat in {{location}} is just one month away.\n\nHere\'s what to know:\n- Packing list: {{packing_list_url}}\n- Travel logistics: {{travel_info}}\n- Please complete your guest profile if you haven\'t already\n\nIf you have any questions, our AI concierge is available 24/7 on our site, or reply to this email.\n\nSee you soon,\nThe Alua Team',
  },
  {
    template_type: 'pre_arrival_7d',
    subject: 'One week until your Alua retreat',
    body: 'Hi {{guest_name}},\n\nOne week to go! Here\'s your detailed schedule and final logistics:\n\n{{daily_schedule}}\n\nAirport pickup: {{pickup_details}}\n\nPlease confirm your dietary preferences are up to date in your profile.\n\nWe can\'t wait to welcome you.\n\nThe Alua Team',
  },
  {
    template_type: 'pre_arrival_1d',
    subject: 'Welcome to Alua, see you tomorrow',
    body: 'Hi {{guest_name}},\n\nTomorrow is the day. Take a deep breath.\n\nMeeting point: {{meeting_point}}\nTime: {{arrival_time}}\nEmergency contact: {{emergency_phone}}\n\nLeave your expectations at home. Come as you are.\n\nSee you soon,\nThe Alua Team',
  },
  {
    template_type: 'post_retreat',
    subject: 'Thank you for being part of Alua',
    body: 'Hi {{guest_name}},\n\nThank you for sharing this experience with us. The container we created together was truly special.\n\nTo support your integration:\n- Your personalized practice plan is attached\n- Join our online studio to continue your breathwork practice\n- Stay connected with your retreat community\n\nThe work doesn\'t end here, it\'s just beginning.\n\nWith love,\nThe Alua Team',
  },
  {
    template_type: 'welcome_studio',
    subject: 'Welcome to the Alua Studio',
    body: 'Hi {{guest_name}},\n\nWelcome to the Alua online studio. Here\'s how to get started:\n\n- Browse our library of guided breathwork practices\n- Join live sessions (2 per month), check the schedule\n- Start with a Foundation practice if you\'re new to breathwork\n\nConsistency matters more than intensity. Even 10 minutes a day transforms.\n\nBreathe well,\nThe Alua Team',
  },
];
