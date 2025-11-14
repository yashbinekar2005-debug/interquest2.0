package com.internquest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.sql.DataSource;
import java.util.ArrayList;
import java.util.List;

@Service
public class DatabaseService {
    
    @Autowired
    private DataSource dataSource;
    
    public void saveUserSkill(Long userId, String skill, int proficiency) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        
        if (skill == null || skill.isEmpty()) {
            throw new IllegalArgumentException("Skill cannot be empty");
        }
        
        if (proficiency < 1 || proficiency > 5) {
            throw new IllegalArgumentException("Proficiency must be between 1 and 5");
        }
        
        String sql = "INSERT INTO user_skills (user_id, skill, proficiency) VALUES (?, ?, ?) " +
                    "ON DUPLICATE KEY UPDATE proficiency = ?";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, userId);
            stmt.setString(2, skill);
            stmt.setInt(3, proficiency);
            stmt.setInt(4, proficiency);
            
            int affectedRows = stmt.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating user skill failed, no rows affected.");
            }
            
        } catch (SQLException e) {
            throw new RuntimeException("Error saving user skill: " + e.getMessage(), e);
        }
    }
    
    public List<String> getUserSkills(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        
        String sql = "SELECT skill FROM user_skills WHERE user_id = ? ORDER BY proficiency DESC";
        List<String> skills = new ArrayList<>();
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, userId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                skills.add(rs.getString("skill"));
            }
            
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving user skills: " + e.getMessage(), e);
        }
        
        return skills;
    }
    
    public List<UserSkill> getUserSkillsWithProficiency(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        
        String sql = "SELECT skill, proficiency FROM user_skills WHERE user_id = ? ORDER BY proficiency DESC";
        List<UserSkill> userSkills = new ArrayList<>();
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, userId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                UserSkill userSkill = new UserSkill();
                userSkill.setSkill(rs.getString("skill"));
                userSkill.setProficiency(rs.getInt("proficiency"));
                userSkills.add(userSkill);
            }
            
        } catch (SQLException e) {
            throw new RuntimeException("Error retrieving user skills with proficiency: " + e.getMessage(), e);
        }
        
        return userSkills;
    }
    
    public void deleteUserSkill(Long userId, String skill) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        
        if (skill == null || skill.isEmpty()) {
            throw new IllegalArgumentException("Skill cannot be empty");
        }
        
        String sql = "DELETE FROM user_skills WHERE user_id = ? AND skill = ?";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, userId);
            stmt.setString(2, skill);
            
            stmt.executeUpdate();
            
        } catch (SQLException e) {
            throw new RuntimeException("Error deleting user skill: " + e.getMessage(), e);
        }
    }
    
    public int getUserSkillCount(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid user ID");
        }
        
        String sql = "SELECT COUNT(*) as count FROM user_skills WHERE user_id = ?";
        
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setLong(1, userId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt("count");
            }
            
            return 0;
            
        } catch (SQLException e) {
            throw new RuntimeException("Error counting user skills: " + e.getMessage(), e);
        }
    }
    
    // Inner class for UserSkill data
    public static class UserSkill {
        private String skill;
        private int proficiency;
        
        // Getters and setters
        public String getSkill() { return skill; }
        public void setSkill(String skill) { this.skill = skill; }
        
        public int getProficiency() { return proficiency; }
        public void setProficiency(int proficiency) { this.proficiency = proficiency; }
    }
}