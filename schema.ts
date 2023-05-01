import type { Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import {
  checkbox,
  file,
  image,
  password,
  relationship,
  select,
  text,
  timestamp,
  integer,
  virtual,
} from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";
import accessControls from "./helpers/accessControls";

const { isAdmin, isAuthorized, filterByOwner, filterMyInfo, filterByAuthor } =
  accessControls;

export const lists: Lists = {
  /**
   * User
   */
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    // access: allowAll,
    access: {
      operation: {
        query: isAuthorized,
        create: isAdmin,
        update: isAuthorized,
        delete: isAuthorized,
      },
      // item: {
      //   create: isAdmin,
      //   update: isAuthorized
      //   delete: isAdmin
      // },
      filter: {
        query: filterMyInfo,
        update: filterMyInfo,
        delete: filterMyInfo,
      },
    },

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      username: text({
        validation: { isRequired: true },
        isIndexed: "unique",
        isFilterable: true,
      }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique",
      }),

      password: password({ validation: { isRequired: true } }),

      avatar: relationship({
        ref: "Image.users",
        many: false,
        ui: {
          displayMode: "cards",
          cardFields: ["image", "altText"],
          inlineEdit: { fields: ["altText"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["image", "altText"] },
        },
      }),

      links: relationship({
        ref: "Link.users",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["title", "href"],
          inlineEdit: {
            fields: ["title", "href", "icon", "target", "published"],
          },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: {
            fields: ["title", "href", "icon", "target", "published", "owner"],
          },
        },
      }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" },
      }),
      isAdmin: checkbox(),
      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      posts: relationship({
        ref: "Post.author",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
      ownedTags: relationship({
        ref: "Tag.owner",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
      ownedImages: relationship({
        ref: "Image.owner",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
      ownedFiles: relationship({
        ref: "File.owner",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
      ownedContents: relationship({
        ref: "Content.owner",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
      ownedSkills: relationship({
        ref: "Skill.owner",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
      ownedLinks: relationship({
        ref: "Link.owner",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
      ownedAboutMe: relationship({
        ref: "AboutMe.owner",
        many: false,
        ui: { hideCreate: true },
      }),
      ownedSkillCategories: relationship({
        ref: "SkillCategory.owner",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),

      ownedContentCategories: relationship({
        ref: "ContentCategory.owner",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
    },
  }),

  /**
   * AboutMe
   */
  AboutMe: list({
    access: {
      operation: {
        query: isAuthorized,
        create: isAuthorized,
        update: isAuthorized,
        delete: isAuthorized,
      },
      item: {
        create: isAuthorized,
        update: isAuthorized,
        delete: isAuthorized,
      },
      filter: {
        query: filterByOwner,
        update: filterByOwner,
        delete: filterByOwner,
      },
    },

    hooks: {
      beforeOperation: async ({
        listKey,
        operation,
        inputData,
        item,
        resolvedData,
        context,
      }) => {
        if (operation === "create") {
          if (resolvedData && context.session?.data?.id) {
            if (!resolvedData.owner) {
              resolvedData.owner = {
                connect: {
                  id: context.session.data.id,
                },
              };
            }
          }
        }
      },
    },

    fields: {
      title: text({ validation: { isRequired: true } }),
      subtitle: text(),

      intro: text({
        validation: { isRequired: true },
        ui: {
          displayMode: "textarea",
          createView: { fieldMode: "edit" },
        },
      }),
      bio: text({
        validation: { isRequired: true },
        ui: {
          displayMode: "textarea",
          createView: { fieldMode: "edit" },
        },
      }),

      name: text({ validation: { isRequired: true } }),
      nameEn: text(),
      siteTitle: text({ validation: { isRequired: true } }),
      siteTitleEn: text(),
      url: text({ validation: { isRequired: true } }),

      twitter: text({ label: "Twitter username" }),
      github: text({ label: "GitHub username" }),
      facebook: text({ label: "Facebook username" }),
      linkedin: text({ label: "Linkedin username" }),
      instagram: text({ label: "Instagram username" }),

      owner: relationship({
        ref: "User.ownedAboutMe",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          // inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true,
        },
        many: false,
      }),
    },
  }),

  /**
   * Post
   */
  Post: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    // access: allowAll,
    access: {
      operation: {
        query: isAuthorized,
        create: isAuthorized,
        update: isAuthorized,
        delete: isAuthorized,
      },
      item: {
        create: isAuthorized,
        update: isAuthorized,
        delete: isAuthorized,
      },
      filter: {
        query: filterByAuthor,
        update: filterByAuthor,
        delete: filterByAuthor,
      },
    },

    hooks: {
      beforeOperation: async ({
        listKey,
        operation,
        inputData,
        item,
        resolvedData,
        context,
      }) => {
        if (operation === "create") {
          if (resolvedData && context.session?.data?.id) {
            if (!resolvedData.author) {
              resolvedData.author = {
                connect: {
                  id: context.session.data.id,
                },
              };
            }
          }
        }
      },
    },

    // this is the fields for our Post list
    fields: {
      title: text({ validation: { isRequired: true } }),

      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),

      markdown: text({
        ui: {
          displayMode: "textarea",
          createView: { fieldMode: "edit" },
        },
      }),

      files: relationship({
        ref: "File.posts",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["file", "altText"],
          inlineEdit: { fields: ["altText"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["file", "altText", "owner"] },
        },
      }),

      images: relationship({
        ref: "Image.posts",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["image", "altText"],
          inlineEdit: { fields: ["altText"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["image", "altText", "owner"] },
        },
      }),

      // with this field, you can set a User as the author for a Post
      author: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: "User.posts",

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name", "email"],
          inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true,
        },
        isFilterable: true,

        // a Post can only have one author
        //   this is the default, but we show it here for verbosity
        many: false,
      }),

      // with this field, you can add some Tags to Posts
      tags: relationship({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: "Tag.posts",

        // a Post can have many Tags, not just one
        many: true,

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name", "owner"] },
        },
      }),
    },
  }),

  /**
   * Tag
   */
  Tag: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    //   access: allowAll,
    access: {
      operation: {
        query: isAuthorized,
        create: isAuthorized,
        update: isAuthorized,
        delete: isAuthorized,
      },
      // item: {
      //   create: isAdmin,
      //   update: isAuthorized
      //   delete: isAdmin
      // },
      filter: {
        query: filterByOwner,
        update: filterByOwner,
        delete: filterByOwner,
      },
    },

    hooks: {
      beforeOperation: async ({
        listKey,
        operation,
        inputData,
        item,
        resolvedData,
        context,
      }) => {
        if (operation === "create") {
          if (resolvedData && context.session?.data?.id) {
            if (!resolvedData.owner) {
              resolvedData.owner = {
                connect: {
                  id: context.session.data.id,
                },
              };
            }
          }
        }
      },
    },

    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: false,
    },

    // this is the fields for our Tag list
    fields: {
      name: text(),
      // this can be helpful to find out all the Posts associated with a Tag
      posts: relationship({
        ref: "Post.tags",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
      contents: relationship({
        ref: "Content.tags",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
      skills: relationship({
        ref: "Skill.tags",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),

      owner: relationship({
        ref: "User.ownedTags",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          // inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true,
        },
        many: false,
      }),
    },
  }),
  /**
   * Image
   */
  Image: list({
    //   access: allowAll, // import { allowAll } from "@keystone-6/core/access";
    access: {
      operation: {
        query: isAuthorized,
        create: isAuthorized,
        update: isAuthorized,
        delete: isAuthorized,
      },
      // item: {
      //   create: isAdmin,
      //   update: isAuthorized
      //   delete: isAdmin
      // },
      filter: {
        query: filterByOwner,
        update: filterByOwner,
        delete: filterByOwner,
      },
    },

    hooks: {
      beforeOperation: async ({
        listKey,
        operation,
        inputData,
        item,
        resolvedData,
        context,
      }) => {
        if (operation === "create") {
          if (resolvedData && context.session?.data?.id) {
            if (!resolvedData.owner) {
              resolvedData.owner = {
                connect: {
                  id: context.session.data.id,
                },
              };
            }
          }
        }
      },
    },

    fields: {
      altText: text(),
      image: image({ storage: "minioImage" }),
      posts: relationship({
        ref: "Post.images",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
      users: relationship({
        ref: "User.avatar",
        many: false,
      }),
      contents: relationship({
        ref: "Content.images",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),

      owner: relationship({
        ref: "User.ownedImages",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          // inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true,
        },
        many: false,
      }),
    },

    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: false,
    },
  }),
  /**
   * File
   */
  File: list({
    //   access: allowAll, // import { allowAll } from "@keystone-6/core/access";
    access: {
      operation: {
        query: isAuthorized,
        create: isAuthorized,
        update: isAuthorized,
        delete: isAuthorized,
      },
      // item: {
      //   create: isAdmin,
      //   update: isAuthorized
      //   delete: isAdmin
      // },
      filter: {
        query: filterByOwner,
        update: filterByOwner,
        delete: filterByOwner,
      },
    },

    hooks: {
      beforeOperation: async ({
        listKey,
        operation,
        inputData,
        item,
        resolvedData,
        context,
      }) => {
        if (operation === "create") {
          if (resolvedData && context.session?.data?.id) {
            if (!resolvedData.owner) {
              resolvedData.owner = {
                connect: {
                  id: context.session.data.id,
                },
              };
            }
          }
        }
      },
    },

    fields: {
      altText: text(),
      file: file({ storage: "minioFile" }),
      posts: relationship({
        ref: "Post.files",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
      owner: relationship({
        ref: "User.ownedFiles",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          // inlineEdit: { fields: ["name", "email"] },
          linkToItem: true,
          inlineConnect: true,
        },
        many: false,
      }),
    },
    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: false,
    },
  }),

  /**
   * ContentCategory
   */
  ContentCategory: list({
    access: {
      operation: {
        query: isAuthorized,
        create: isAuthorized,
        update: isAuthorized,
        delete: isAuthorized,
      },
      // item: {
      //   create: isAdmin,
      //   update: isAuthorized
      //   delete: isAdmin
      // },
      filter: {
        query: filterByOwner,
        update: filterByOwner,
        delete: filterByOwner,
      },
    },

    hooks: {
      beforeOperation: async ({
        listKey,
        operation,
        inputData,
        item,
        resolvedData,
        context,
      }) => {
        if (operation === "create") {
          if (resolvedData && context.session?.data?.id) {
            if (!resolvedData.owner) {
              resolvedData.owner = {
                connect: {
                  id: context.session.data.id,
                },
              };
            }
          }
        }
      },
    },

    fields: {
      name: text({ validation: { isRequired: true } }),

      order: integer({
        validation: { isRequired: true },
        defaultValue: 1,
        isOrderable: true,
      }),

      published: checkbox({ defaultValue: true }),

      contents: relationship({
        ref: "Content.category",
        many: true,
        ui: {
          hideCreate: true,
        },
      }),
      owner: relationship({
        ref: "User.ownedContentCategories",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          linkToItem: true,
          inlineConnect: true,
        },
        many: false,
      }),
    },
  }),

  /**
   * Content
   */
  Content: list({
    access: {
      operation: {
        query: isAuthorized,
        create: isAuthorized,
        update: isAuthorized,
        delete: isAuthorized,
      },
      // item: {
      //   create: isAdmin,
      //   update: isAuthorized
      //   delete: isAdmin
      // },
      filter: {
        query: filterByOwner,
        update: filterByOwner,
        delete: filterByOwner,
      },
    },

    hooks: {
      beforeOperation: async ({
        listKey,
        operation,
        inputData,
        item,
        resolvedData,
        context,
      }) => {
        if (operation === "create") {
          if (resolvedData && context.session?.data?.id) {
            if (!resolvedData.owner) {
              resolvedData.owner = {
                connect: {
                  id: context.session.data.id,
                },
              };
            }
          }
        }
      },
    },

    fields: {
      category: relationship({
        ref: "ContentCategory.contents",
        many: false,
        ui: {
          displayMode: "select",
          createView: {
            fieldMode: "edit",
          },
          labelField: "name",
        },
        isOrderable: true,
        isFilterable: true,
      }),

      title: text({ validation: { isRequired: true } }),
      period: text({ validation: { isRequired: true } }),
      subtitle: text(),
      state: select({
        options: [
          { value: "입사", label: "입사" },
          { value: "퇴사", label: "퇴사" },
          { value: "입학", label: "입학" },
          { value: "졸업", label: "졸업" },
          { value: "진행중", label: "진행중" },
          { value: "완료", label: "완료" },
        ],
        validation: { isRequired: true },
      }),

      description: text({
        validation: { isRequired: true },
        ui: {
          displayMode: "textarea",
          createView: { fieldMode: "edit" },
        },
      }),

      images: relationship({
        ref: "Image.contents",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["image", "altText"],
          inlineEdit: { fields: ["altText"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["image", "altText"] },
        },
      }),

      links: relationship({
        ref: "Link.contents",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["title", "href"],
          inlineEdit: {
            fields: ["title", "href", "icon", "target", "published"],
          },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: {
            fields: ["title", "href", "icon", "target", "published", "owner"],
          },
        },
      }),

      tags: relationship({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: "Tag.contents",

        // a Post can have many Tags, not just one
        many: true,

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "select",
          // cardFields: ["name"],
          // inlineEdit: { fields: ["name"] },
          // linkToItem: true,
          // inlineConnect: true,
          // inlineCreate: { fields: ["name", "owner"] },
        },
      }),

      published: checkbox({ defaultValue: true }),

      owner: relationship({
        ref: "User.ownedContents",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          linkToItem: true,
          inlineConnect: true,
        },
        many: false,
      }),
    },
  }),

  /**
   * SkillCategory
   */
  SkillCategory: list({
    access: {
      operation: {
        query: isAuthorized,
        create: isAuthorized,
        update: isAuthorized,
        delete: isAuthorized,
      },
      // item: {
      //   create: isAdmin,
      //   update: isAuthorized
      //   delete: isAdmin
      // },
      filter: {
        query: filterByOwner,
        update: filterByOwner,
        delete: filterByOwner,
      },
    },

    hooks: {
      beforeOperation: async ({
        listKey,
        operation,
        inputData,
        item,
        resolvedData,
        context,
      }) => {
        if (operation === "create") {
          if (resolvedData && context.session?.data?.id) {
            if (!resolvedData.owner) {
              resolvedData.owner = {
                connect: {
                  id: context.session.data.id,
                },
              };
            }
          }
        }
      },
    },

    fields: {
      name: text({ validation: { isRequired: true } }),

      icon: select({
        options: [
          { value: "star", label: "star" },
          { value: "like", label: "like" },
        ],
      }),

      order: integer({
        validation: { isRequired: true },
        defaultValue: 1,
        isOrderable: true,
      }),

      published: checkbox({ defaultValue: true }),

      skills: relationship({
        ref: "Skill.category",
        many: true,
        ui: {
          hideCreate: true,
        },
      }),
      owner: relationship({
        ref: "User.ownedSkillCategories",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          linkToItem: true,
          inlineConnect: true,
        },
        many: false,
      }),
    },
  }),

  /**
   * Skill
   */
  Skill: list({
    access: {
      operation: {
        query: isAuthorized,
        create: isAuthorized,
        update: isAuthorized,
        delete: isAuthorized,
      },
      // item: {
      //   create: isAdmin,
      //   update: isAuthorized
      //   delete: isAdmin
      // },
      filter: {
        query: filterByOwner,
        update: filterByOwner,
        delete: filterByOwner,
      },
    },

    hooks: {
      beforeOperation: async ({
        listKey,
        operation,
        inputData,
        item,
        resolvedData,
        context,
      }) => {
        if (operation === "create") {
          if (resolvedData && context.session?.data?.id) {
            if (!resolvedData.owner) {
              resolvedData.owner = {
                connect: {
                  id: context.session.data.id,
                },
              };
            }
          }
        }
      },
    },

    fields: {
      category: relationship({
        ref: "SkillCategory.skills",
        many: false,
        ui: {
          displayMode: "select",
          createView: {
            fieldMode: "edit",
          },
          labelField: "name",
        },
        isOrderable: true,
        isFilterable: true,
      }),

      title: text({ validation: { isRequired: true } }),

      description: text({
        ui: {
          displayMode: "textarea",
          createView: { fieldMode: "edit" },
        },
      }),

      score: integer({ validation: { isRequired: true } }),

      scoreMax: integer({ validation: { isRequired: true } }),

      href: text(),

      links: relationship({
        ref: "Link.skills",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["title", "href"],
          inlineEdit: {
            fields: ["title", "href", "icon", "target", "published"],
          },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: {
            fields: ["title", "href", "icon", "target", "published", "owner"],
          },
        },
      }),

      tags: relationship({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: "Tag.skills",

        // a Post can have many Tags, not just one
        many: true,

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "select",
          // cardFields: ["name"],
          // inlineEdit: { fields: ["name"] },
          // linkToItem: true,
          // inlineConnect: true,
          // inlineCreate: { fields: ["name", "owner"] },
          // createView:
        },
      }),

      published: checkbox({ defaultValue: true }),

      owner: relationship({
        ref: "User.ownedSkills",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          linkToItem: true,
          inlineConnect: true,
        },
        many: false,
      }),
    },
  }),

  /**
   * Link
   */
  Link: list({
    access: {
      operation: {
        query: isAdmin,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
      // item: {
      //   create: isAdmin,
      //   update: isAuthorized
      //   delete: isAdmin
      // },
      filter: {
        query: filterByOwner,
        update: filterByOwner,
        delete: filterByOwner,
      },
    },

    hooks: {
      beforeOperation: async ({
        listKey,
        operation,
        inputData,
        item,
        resolvedData,
        context,
      }) => {
        if (operation === "create") {
          if (resolvedData && context.session?.data?.id) {
            if (!resolvedData.owner) {
              resolvedData.owner = {
                connect: {
                  id: context.session.data.id,
                },
              };
            }
          }
        }
      },
    },

    fields: {
      title: text({ validation: { isRequired: true } }),
      href: text({ validation: { isRequired: true } }),
      icon: select({
        options: [
          { value: "mail", label: "Mail" },
          { value: "npm", label: "NPM" },
          { value: "github", label: "GitHub" },
          { value: "home", label: "Home Page" },
          { value: "site", label: "Web Site" },
          { value: "nuget", label: "Nuget" },
          { value: "ios", label: "iOS" },
          { value: "windows", label: "Windows Store" },
          { value: "android", label: "Google play" },
          { value: "blog", label: "Blog" },
        ],
        validation: { isRequired: true },
      }),
      target: select({
        options: [
          { value: "_self", label: "Self" },
          { value: "_blank", label: "New page" },
        ],
        validation: { isRequired: true },
      }),

      published: checkbox({ defaultValue: true }),

      users: relationship({
        ref: "User.links",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
      contents: relationship({
        ref: "Content.links",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),
      skills: relationship({
        ref: "Skill.links",
        many: true,
        ui: { hideCreate: true, displayMode: "count" },
      }),

      owner: relationship({
        ref: "User.ownedLinks",
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          linkToItem: true,
          inlineConnect: true,
        },
        many: false,
      }),
    },
  }),
};
