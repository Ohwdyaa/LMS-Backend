const Permissions = require("../models/permission_teams");
const roleTeams = require("../models/role_teams");
const Module = require("../models/module_permissions");
const { err } = require("../utils/custom_error");
const { uuid } = require("../utils/tools");

// Berisi logic bisnis dan DFS implementation
class RoleHierarchyService {
  constructor(roleTeamsModel) {
    this.roleTeamsModel = roleTeamsModel;
  }

  async performDFS(roleId, visited = new Set(), path = [], depth = 0) {
    if (visited.has(roleId)) {
      return {
        hasCycle: true,
        cyclePath: [...path, roleId],
        maxDepth: depth
      };
    }

    visited.add(roleId);
    path.push(roleId);

    const directRelations = await this.roleTeamsModel.getDirectParentAndChildren(roleId);
    const children = directRelations.filter(r => r.relationship_type === 'child');
    
    let maxDepthFound = depth;
    let cycleDetected = null;

    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const result = await this.performDFS(child.id, visited, path, depth + 1);
      
      if (result.hasCycle) {
        cycleDetected = result;
        break;
      }
      
      maxDepthFound = Math.max(maxDepthFound, result.maxDepth);
    }

    path.pop();
    return cycleDetected || { hasCycle: false, maxDepth: maxDepthFound };
  }

  async validateInheritanceRules(roleId, parentId) {
    // Validasi rules bisnis
    const result = {
      isValid: true,
      errors: []
    };

    // 1. Check depth limit
    const depthAnalysis = await this.performDFS(parentId);
    if (depthAnalysis.maxDepth >= 5) {
      result.isValid = false;
      result.errors.push({
        code: 'MAX_DEPTH_EXCEEDED',
        message: 'Maximum inheritance depth would be exceeded'
      });
    }

    // 2. Check circular dependency
    if (depthAnalysis.hasCycle || depthAnalysis.cyclePath?.includes(roleId)) {
      result.isValid = false;
      result.errors.push({
        code: 'CIRCULAR_DEPENDENCY',
        message: 'Creating this inheritance would result in a circular dependency',
        details: depthAnalysis.cyclePath
      });
    }

    // 3. Check existing inheritance
    const existing = await this.roleTeamsModel.checkExistingInheritance(roleId, parentId);
    if (existing) {
      result.isValid = false;
      result.errors.push({
        code: 'DUPLICATE_INHERITANCE',
        message: 'Inheritance relationship already exists'
      });
    }

    return result;
  }

  async analyzeRoleStructure(roleId) {
    const analysis = await this.performDFS(roleId);
    const roleDetails = await this.roleTeamsModel.getRoleTeamById(roleId);

    if (!roleDetails) {
      throw new Error('Role not found');
    }

    return {
      role: roleDetails,
      structure: {
        maxDepth: analysis.maxDepth,
        hasCyclicDependency: analysis.hasCycle,
        cyclePath: analysis.hasCycle ? analysis.cyclePath : undefined
      }
    };
  }

  async findPathBetweenRoles(startId, targetId) {
    const visited = new Set();
    const path = [];
    
    const dfs = async (currentId) => {
      if (currentId === targetId) {
        return true;
      }

      if (visited.has(currentId)) {
        return false;
      }

      visited.add(currentId);
      path.push(currentId);

      const relations = await this.roleTeamsModel.getDirectParentAndChildren(currentId);
      const children = relations.filter(r => r.relationship_type === 'child');
      
      for (let i = 0; i < children.length; i++) {
        if (await dfs(children[i].id)) {
          return true;
        }
      }

      path.pop();
      return false;
    };

    const found = await dfs(startId);
    if (!found) {
      return null;
    }

    // Get details for path
    const pathDetails = [];
    for (let i = 0; i < path.length; i++) {
      const roleDetail = await this.roleTeamsModel.getRoleTeamById(path[i]);
      pathDetails.push(roleDetail);
    }

    return {
      path: pathDetails,
      length: pathDetails.length - 1
    };
  }
}

module.exports = RoleHierarchyService;