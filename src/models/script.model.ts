import { model, Model, Schema, Types } from 'mongoose'

import { schemaOptions } from '../config/schemaOptions'

export interface IScript {
  _id: Types.ObjectId;
  isActive: boolean;
  projectId: Types.ObjectId;
  categoryGroupId: Types.ObjectId;
  scenesOrdered: Types.ObjectId[];
  name: string;
  description: string;
  episode: string;
  filename: string;
  revisionName: string;
  revisionDate: string;
  titlePage: {
    content: string;
  };
  blockTypes: {
    name: string;
    pageBreak: boolean;
    next: Types.ObjectId;
    styles: object;
  }[];
  scenePosition: {
    left: {
      position: string;
      visible: boolean;
    };
    right: {
      position: string;
      visible: boolean;
    };
  };
  moreContinued: {
    dialogueBottom: {
      text: string;
      visible: boolean;
    };
    dialogueTop: {
      text: string;
      visible: boolean;
    };
    sceneBottom: {
      text: string;
      visible: boolean;
    };
    sceneTop: {
      text: string;
      visible: boolean;
      sceneVisible: boolean;
    };
  };
  header: {
    visible: boolean;
    position: string;
    content: string;
  };
  footer: {
    visible: boolean;
    position: string;
    content: string;
  };
  watermark: {
    visible: boolean;
    text: string;
    style: object;
  };
  pageSize: string;
  margins: string[];
  isPagesLocked: boolean;
  lockLevel: number;
}
interface IScriptMethods {} // define methods here
interface IScriptModel extends Model<IScript, {}, IScriptMethods> {} // define static methods here

const schema = new Schema<IScript, IScriptModel, IScriptMethods>({
  isActive: {
    type: Boolean,
    default: true,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  categoryGroupId: {
    type: Schema.Types.ObjectId,
    ref: 'CategoryGroup',
    default: null
  },
  scenesOrdered: [{
    type: Schema.Types.ObjectId,
    ref: 'ScriptScene',
    default: []
  }],
  name: {
    type: String,
    maxlength: [100, 'Script names cannot be longer than 100 characters'],
    default: null,
  },
  description: {
    type: String,
    maxlength: [255, 'Script descriptions cannot be longer than 255 characters'],
    default: null,
  },
  episode: {
    type: String,
    maxlength: [50, 'Script names cannot be longer than 50 characters'],
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  revisionName: {
    type: String,
    maxlength: [50, 'Script revision names cannot be longer than 50 characters'],
    default: null,
  },
  revisionDate: {
    type: String,
    default: null,
  },
  titlePage: {
    content: {
      type: String,
      get: function(data:any) {
        try { 
          return JSON.parse(data)
        } catch(error) { 
          return data
        }
      },
      set: function(data:any) {
        return JSON.stringify(data)
      }
    }
  },
  blockTypes: [{
    _id: Schema.Types.ObjectId,
    name: {
      type: String,
      default: null
    },
    pageBreak: {
      type: Boolean,
      default: false
    },
    next: Schema.Types.ObjectId,
    styles: { 
      type: Object,
      default: null
    }  
  }],
  scenePosition: {
    left: { 
      position: {
        type: String,
        default: '0',
      }, 
      visible: {
        type: Boolean,
        default: true
      },
    },
    right: { 
      position: {
        type: String,
        default: '0',
      }, 
      visible: {
        type: Boolean,
        default: true
      },
    }
  },
  moreContinued: {
    dialogueBottom: { 
      text: {
        type: String,
        default: '(MORE.)'
      }, 
      visible: {
        type: Boolean,
        default: true
      },
    },
    dialogueTop: { 
      text: {
        type: String,
        default: '(CONT\'D.)'
      }, 
      visible: {
        type: Boolean,
        default: true
      },
    },
    sceneBottom: { 
      text: {
        type: String,
        default: '(CONTINUED.)'
      }, 
      visible: {
        type: Boolean,
        default: true
      },
    },
    sceneTop: { 
      text: {
        type: String,
        default: 'CONTINUED:.'
      }, 
      visible: {
        type: Boolean,
        default: true
      }, 
      sceneVisible: {
        type: Boolean,
        default: true
      }
    }
  },
  header: {
    visible: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: '0',
    }, 
    content: {
      type: String,
      get: function(data:any) {
        try { 
          return JSON.parse(data)
        } catch(error) { 
          return data
        }
      },
      set: function(data:any) {
        return JSON.stringify(data)
      }
    }
  },
  footer: {
    visible: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: '0',
    }, 
    content: {
      type: String,
      get: function(data:any) {
        try { 
          return JSON.parse(data)
        } catch(error) { 
          return data
        }
      },
      set: function(data:any) {
        return JSON.stringify(data)
      }
    }
  },
  watermark: {
    visible: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: ''
    },
    style: { 
      type: Object,
      default: null
    }
  },
  pageSize: {
    type: String,
    default: 'letter',
  },
  margins: [{
    type: String,
  }],
  isPagesLocked: {
    type: Boolean,
    default: false
  },
  lockLevel: {
    type: Number,
    default: 1
  },
}, {...schemaOptions, toJSON: { getters: true }})

export const scriptKeys = Object.keys(schema.paths) // array of keys of schema

export const Script = model<IScript, IScriptModel>('Script', schema)