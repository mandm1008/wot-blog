import { CSSProperties } from 'react'

type Member = {
  name: string
  avatar: string
  jobs: string[]
  discriptions: { title?: string; content: string; style?: CSSProperties }[]
}

export const TEAM_LIST: Member[] = [
  {
    name: 'Hailey Phung',
    avatar: 'Hailey',
    jobs: ['Founder'],
    discriptions: [
      {
        content: 'Hello my guys!'
      },
      {
        content: `
          I'm Phung Phuong Anh, a native Vietnamese person.
          I know you can have trouble calling me by my birth name.
          It's hard to pronounce, so I dared rename mine that is "Hailey Phung".
          "Hailey" is a first name and "Phung" is a family name.
          You can call me "Hailey", my foreign name, or "Anh" which is my birth name.
          Skip this part if you feel it's verbose.
          Oh, it's embarrassing.
        `
      },
      {
        title: 'My career.',
        content: `
          I'm honestly a student at university, and my major is International Business.
          I started writing content and copywriting when I was 18 years old. And now, I'm twenty.
          Compared to other profound copywriters, my little knowledge and experience are as small as a grain of sand.
          It isn't worth mentioning.
          But that's not why I'm guilty and set limits for myself.
        `
      },
      {
        title: 'Why do I choose Copywriting topics to write a blog?',
        content: `
          I'm an expert and haven't huge experience in Copywriting.
          I'm a person who studied hard and tried every day.
          My English writing skill isn't well, but it's at an acceptable level.
          The purpose I set up this blog web is the inspiration for beginners copywriters.
          Copywriting is hard to self-learn.  I know your desperate feeling about having to study alone.
          Not everybody has enough patience to learn and practice.
          There will also be a time when you don't earn any cents from copywriting, even if it lasted consecutive months.
        `
      },
      {
        title: 'No worries!',
        content: `
          I'm here.
          I always believe you will succeed.
          You're not alone, we are striving together in order to improve ourselves and dedicate ourselves to society.
          We are just beginners, inexperienced, not genius.
          Maybe we are beaten by the negative, challenges, and pressure.
        `
      },
      {
        title: 'But remember!',
        content: `
          "Genius is one percent inspiration and ninety-nine percent perspiration."
        `,
        style: { fontWeight: 700 }
      },
      {
        content: `
          Everyone has got an equal brain. 
          All are in the same firing line.
        `
      }
    ]
  }
]
